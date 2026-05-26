#!/usr/bin/env node
/**
 * Activación de usuarios Casita de Paz – tienda.tndr.eu
 *
 * Uso:
 *   node scripts/activar-casita-paz.mjs
 *   node scripts/activar-casita-paz.mjs --dry-run
 *
 * Variables de entorno requeridas:
 *   SUPABASE_SERVICE_ROLE_KEY
 *   RESEND_API_KEY
 */

const DRY_RUN = process.argv.includes('--dry-run');

const SUPABASE_URL       = 'https://oczxcsymcqjvibjltfrw.supabase.co';
const SUPABASE_KEY       = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY     = process.env.RESEND_API_KEY;
const TEMP_PASSWORD      = 'TiendaTNDR#CasitaPaz2026';
const FROM_EMAIL         = 'tienda@tndr.eu';
const TIENDA_URL         = 'https://tienda.tndr.eu';
const DELAY_MS           = 300;

const EMAILS = [
  '671500333n@gmail.com',
  'adry_villa@hotmail.com',
  'alexkizer2547@gmail.com',
  'anafsalas@gmail.com',
  'andreabufanio@hotmail.com',
  'annampajares@hotmail.com',
  'carlosrojo.92@gmail.com',
  'ceciperezminguez@gmail.com',
  'cim.monica15@gmail.com',
  'contacto@espacionatura.es',
  'crisaureamar@gmail.com',
  'emilia.sanchez.amor@gmail.com',
  'fernandezdelahozvidal@gmail.com',
  'finarey2012@hotmail.com',
  'iblascogastesi@gmail.com',
  'info@seequilibrium.com',
  'jcacera@gmail.com',
  'jcgarciasola@gmail.com',
  'jfukuan@gmail.com',
  'laurapueyopardo@gmail.com',
  'luisagracia2005@hotmail.de',
  'm.abadjim@hotmail.com',
  'm.glorialeonruiz@gmail.com',
  'marisa@marialuisasotes.com',
  'patricia.echevarria.ruiz@gmail.com',
  'rapaquelpe1@hotmail.com',
  'sylvieriescobernier@gmail.com',
  'tndrpalma.ana@gmail.com',
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function supabaseHeaders() {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  };
}

/** Devuelve todos los usuarios de Supabase Auth (maneja paginación). */
async function fetchAllUsers() {
  const allUsers = [];
  let page = 1;
  const perPage = 1000;

  while (true) {
    const res = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users?page=${page}&per_page=${perPage}`,
      { headers: supabaseHeaders() }
    );
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Error listando usuarios (página ${page}): ${res.status} ${body}`);
    }
    const data = await res.json();
    const users = data.users ?? [];
    allUsers.push(...users);
    if (users.length < perPage) break;
    page++;
  }

  return allUsers;
}

/** Actualiza contraseña y confirma el email del usuario. */
async function activateUser(userId) {
  const res = await fetch(
    `${SUPABASE_URL}/auth/v1/admin/users/${userId}`,
    {
      method: 'PUT',
      headers: supabaseHeaders(),
      body: JSON.stringify({
        password: TEMP_PASSWORD,
        email_confirm: true,
      }),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Error activando usuario ${userId}: ${res.status} ${body}`);
  }
  return res.json();
}

/** Envía el email de bienvenida con acceso vía Resend. */
async function sendWelcomeEmail(email) {
  const html = buildEmailHtml(email);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Tienda TNDR <${FROM_EMAIL}>`,
      to: [email],
      subject: 'Tu acceso a la Tienda TNDR ya está listo',
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Error enviando email a ${email}: ${res.status} ${body}`);
  }
  return res.json();
}

// ─── Plantilla HTML ──────────────────────────────────────────────────────────

function buildEmailHtml(email) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<title>Tu acceso a la Tienda TNDR ya está listo</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>

<body style="margin:0; padding:0; background:#e8e2d5; font-family:'Poppins', Arial, sans-serif;">

<div style="display:none; max-height:0; overflow:hidden; opacity:0;">
Tu cuenta en la Tienda TNDR ya está activa · Accede con tu email y contraseña temporal
</div>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e8e2d5;">
<tr>
<td align="center" style="padding:30px 12px;">

  <table width="600" cellpadding="0" cellspacing="0" border="0"
    style="max-width:600px; width:100%; background:#ffffff; border-radius:16px;
           box-shadow:0 12px 36px rgba(0,0,0,0.10); overflow:hidden;">

    <!-- CABECERA VERDE OLIVA -->
    <tr>
      <td style="background:#3d5228; padding:26px 30px;">
        <div style="font-size:11px; letter-spacing:2px; text-transform:uppercase;
                    color:rgba(255,255,255,0.70); font-weight:600; font-family:'Poppins',Arial,sans-serif;
                    margin-bottom:10px;">
          TNDR · Tienda Online
        </div>
        <div style="font-size:13px; color:rgba(255,255,255,0.85); font-weight:400;
                    font-family:'Poppins',Arial,sans-serif; line-height:1.5;">
          Tu acceso ya está listo
        </div>
        <div style="font-size:26px; color:#ffffff; font-weight:800; margin-top:6px; line-height:1.25;
                    font-family:'Poppins',Arial,sans-serif; letter-spacing:-0.3px;">
          Bienvenida/o a la<br>Tienda TNDR
        </div>
      </td>
    </tr>

    <!-- BANDA SALVIA -->
    <tr>
      <td style="background:#c8cdb8; padding:10px 30px;">
        <div style="font-size:12px; color:#3d5228; font-weight:600; letter-spacing:0.5px;
                    font-family:'Poppins',Arial,sans-serif;">
          ✦ &nbsp;Socia/o Casita de Paz
        </div>
      </td>
    </tr>

    <!-- CUERPO -->
    <tr>
      <td style="padding:32px 30px 14px 30px; color:#2d2d2d; font-size:15px; line-height:1.8;
                 font-family:'Poppins',Arial,sans-serif;">
        <p style="margin:0 0 18px 0;">
          Hemos preparado tu cuenta de socia/o de la
          <strong style="color:#3d5228;">Casita de Paz</strong> en nuestra tienda online.
          Ya puedes acceder con estos datos:
        </p>
      </td>
    </tr>

    <!-- BLOQUE CREDENCIALES -->
    <tr>
      <td style="padding:0 30px 14px 30px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
          style="background:#f5f0e6; border-radius:12px; border-left:4px solid #3d5228;">
          <tr>
            <td style="padding:20px 24px;">
              <div style="font-size:11px; font-weight:700; text-transform:uppercase;
                          letter-spacing:1.5px; color:#3d5228; margin-bottom:16px;
                          font-family:'Poppins',Arial,sans-serif;">
                Tus datos de acceso
              </div>
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="font-size:14px; color:#2d2d2d; padding-bottom:12px;
                              font-family:'Poppins',Arial,sans-serif;">
                    <span style="font-weight:600; color:#5a5040; display:inline-block; width:100px;">Email:</span>
                    <span style="color:#3d5228; font-weight:700;">${email}</span>
                  </td>
                </tr>
                <tr>
                  <td style="font-size:14px; color:#2d2d2d;
                              font-family:'Poppins',Arial,sans-serif;">
                    <span style="font-weight:600; color:#5a5040; display:inline-block; width:100px;">Contraseña:</span>
                    <span style="background:#3d5228; color:#ffffff; font-weight:700;
                                 padding:5px 14px; border-radius:6px; letter-spacing:0.3px;
                                 font-size:13px; font-family:'Poppins',Arial,sans-serif;">${TEMP_PASSWORD}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- DESCUENTO -->
    <tr>
      <td style="padding:0 30px 14px 30px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
          style="background:#eef0e8; border-radius:12px;">
          <tr>
            <td style="padding:16px 20px; font-size:14px; color:#2d2d2d; line-height:1.7;
                        font-family:'Poppins',Arial,sans-serif;">
              🌿 &nbsp;Como socia/o de la <strong style="color:#3d5228;">Casita de Paz</strong>
              tienes un <strong style="color:#3d5228;">15% de descuento automático</strong>
              en todos tus pedidos. Se aplica solo al finalizar la compra, sin necesidad de código.
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- BOTÓN CTA -->
    <tr>
      <td align="center" style="padding:20px 30px 26px 30px;">
        <a href="${TIENDA_URL}"
          style="background:#3d5228; color:#ffffff; text-decoration:none; font-weight:700;
                 font-size:15px; padding:14px 40px; border-radius:999px; display:inline-block;
                 letter-spacing:0.5px; font-family:'Poppins',Arial,sans-serif;">
          Acceder a la tienda
        </a>
      </td>
    </tr>

    <!-- NOTA CONTRASEÑA -->
    <tr>
      <td style="padding:0 30px 28px 30px;">
        <p style="margin:0; font-size:12px; color:#8a7f6e; line-height:1.6;
                  font-family:'Poppins',Arial,sans-serif; text-align:center;">
          Te recomendamos cambiar tu contraseña tras el primer acceso desde tu perfil.
        </p>
      </td>
    </tr>

    <!-- FIRMA -->
    <tr>
      <td style="padding:20px 30px 28px 30px; color:#2d2d2d; font-size:14px; line-height:1.7;
                 border-top:1px solid #ede8de; font-family:'Poppins',Arial,sans-serif;">
        Un saludo,<br>
        <strong style="color:#3d5228;">Equipo TNDR</strong>
        <span style="color:#b0a898;"> · </span>
        <a href="mailto:tienda@tndr.eu"
           style="color:#3d5228; text-decoration:none; font-weight:500;">tienda@tndr.eu</a>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background:#f0ebe0; padding:18px 24px; text-align:center;
                 border-top:1px solid #e0dace;">
        <div style="font-size:18px; font-weight:800; color:#3d5228; letter-spacing:1px;
                    font-family:'Poppins',Arial,sans-serif;">
          ✦ TNDR
        </div>
        <div style="margin-top:8px; font-size:11px; color:#8a7f6e; line-height:1.6;
                    font-family:'Poppins',Arial,sans-serif;">
          Recibes este email porque eres socia/o de la Casita de Paz con cuenta en
          <a href="${TIENDA_URL}"
             style="color:#3d5228; text-decoration:none; font-weight:500;">tienda.tndr.eu</a>.
        </div>
      </td>
    </tr>

  </table>
</td>
</tr>
</table>

</body>
</html>`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (!SUPABASE_KEY) {
    console.error('❌ Falta SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.');
    process.exit(1);
  }
  if (!RESEND_API_KEY) {
    console.error('❌ Falta RESEND_API_KEY en las variables de entorno.');
    process.exit(1);
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  Activación Casita de Paz – tienda.tndr.eu`);
  if (DRY_RUN) console.log('  ⚠️  MODO DRY-RUN: no se harán cambios reales');
  console.log(`  ${EMAILS.length} usuarios a procesar`);
  console.log(`${'─'.repeat(60)}\n`);

  // Cargar todos los usuarios una sola vez para minimizar llamadas a la API
  console.log('📋 Obteniendo lista de usuarios de Supabase...');
  const allUsers = await fetchAllUsers();
  console.log(`   ${allUsers.length} usuarios encontrados en Supabase Auth\n`);

  const userByEmail = new Map(allUsers.map(u => [u.email?.toLowerCase(), u]));

  const results = { ok: [], skipped: [], errors: [] };

  for (let i = 0; i < EMAILS.length; i++) {
    const email = EMAILS[i];
    const tag   = `[${String(i + 1).padStart(2, '0')}/${EMAILS.length}] ${email}`;

    const user = userByEmail.get(email.toLowerCase());

    if (!user) {
      console.log(`  ⚠️  ${tag} → NO encontrado en Supabase`);
      results.errors.push({ email, reason: 'Usuario no encontrado en Supabase' });
      continue;
    }

    // Saltar si ya está confirmado
    if (user.email_confirmed_at || user.confirmed_at) {
      console.log(`  ⏭️  ${tag} → ya activo (omitido)`);
      results.skipped.push(email);
      continue;
    }

    try {
      if (!DRY_RUN) {
        await activateUser(user.id);
      }
      console.log(`  ✅ ${tag} → cuenta activada${DRY_RUN ? ' (simulado)' : ''}`);

      if (!DRY_RUN) {
        await sendWelcomeEmail(email);
      }
      console.log(`  📧 ${tag} → email enviado${DRY_RUN ? ' (simulado)' : ''}`);

      results.ok.push(email);
    } catch (err) {
      console.error(`  ❌ ${tag} → ERROR: ${err.message}`);
      results.errors.push({ email, reason: err.message });
    }

    if (i < EMAILS.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  // Resumen final
  console.log(`\n${'─'.repeat(60)}`);
  console.log('  RESUMEN');
  console.log(`${'─'.repeat(60)}`);
  console.log(`  ✅ Activados y notificados : ${results.ok.length}`);
  console.log(`  ⏭️  Ya activos (omitidos)   : ${results.skipped.length}`);
  console.log(`  ❌ Errores                 : ${results.errors.length}`);

  if (results.ok.length > 0) {
    console.log('\n  Procesados correctamente:');
    results.ok.forEach(e => console.log(`    · ${e}`));
  }
  if (results.skipped.length > 0) {
    console.log('\n  Omitidos (ya activos):');
    results.skipped.forEach(e => console.log(`    · ${e}`));
  }
  if (results.errors.length > 0) {
    console.log('\n  Errores:');
    results.errors.forEach(({ email, reason }) => console.log(`    · ${email} → ${reason}`));
  }

  console.log(`\n${'─'.repeat(60)}\n`);

  if (results.errors.length > 0) process.exit(1);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
