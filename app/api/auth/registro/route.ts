import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const registroSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export async function POST(request: NextRequest) {
  const limited = rateLimit(request);
  if (limited) return limited;

  try {
    const body = await request.json();
    const parsed = registroSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;
    const supabase = createClient();

    // 1. Crear usuario en auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      let errorMessage = authError?.message ?? "Error al crear usuario";

      if (errorMessage.toLowerCase().includes("rate limit exceeded")) {
        errorMessage =
          "Demasiados intentos de registro. Por favor, intenta de nuevo más tarde.";
      } else if (
        errorMessage.toLowerCase().includes("user already registered")
      ) {
        errorMessage = "Este correo electrónico ya está registrado.";
      } else if (errorMessage.toLowerCase().includes("security purposes")) {
        errorMessage = "Por motivos de seguridad, por favor intenta más tarde.";
      }

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // 2. Insertar perfil con admin client (service-role) para evitar restricción RLS
    // cuando email confirmation está activo y la sesión todavía no existe
    const adminClient = createAdminClient();
    const { error: profileError } = await adminClient.from("profiles").insert({
      id: authData.user.id,
      nombre_completo: "", // Empty initially, to be filled in survey
      rol: "paciente",
      ingresos_mensuales: null,
    });

    if (profileError) {
      console.error("[registro] Error inserting profile:", profileError);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Registro exitoso. Revisa tu correo para confirmar tu cuenta.",
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
