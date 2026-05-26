#!/usr/bin/env node
/**
 * Alta masiva de alumnos TNDR – tienda.tndr.eu
 *
 * Uso:
 *   node scripts/activar-alumnos-tndr.mjs
 *   node scripts/activar-alumnos-tndr.mjs --dry-run
 *
 * Variables de entorno requeridas:
 *   SUPABASE_SERVICE_ROLE_KEY
 *   RESEND_API_KEY
 */

const DRY_RUN = process.argv.includes('--dry-run');

const SUPABASE_URL   = 'https://oczxcsymcqjvibjltfrw.supabase.co';
const SUPABASE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TEMP_PASSWORD  = 'AlumnoTNDR#2026';
const ROLE_ID        = '36d48bae-4fec-4657-9c99-014ec4541981';
const FROM_EMAIL     = 'tienda@tndr.eu';
const TIENDA_URL     = 'https://tienda.tndr.eu';
const DELAY_MS       = 300;

const EMAILS = [
  'amador.p.a.123@gmail.com',
  'enesenciaherbolario@gmail.com',
  'amalisaibaha@gmail.com',
  'aplantalamor@yahoo.es',
  'agustinbcn@yahoo.es',
  'aguitar1723@gmail.com',
  'abelguzman33@hotmail.com',
  'alex.garci@hotmail.com',
  'tndrcursos.andresmendizabal@gmail.com',
  'aidagargas@hotmail.com',
  'alexsanchezcoca@gmail.com',
  'alexandradegomez83@gmail.com',
  'am.pedrazagiron@gmail.com',
  'aidalopezvalcarce@gmail.com',
  'aniyjosecarlos@hotmail.com',
  'tndrcursos.aliciarevilla@gmail.com',
  'alexkizer2547@gmail.com',
  'ajrigat@gmail.com',
  'anaigles@hotmail.com',
  'aranmg76@gmail.com',
  'annampajares@hotmail.com',
  'alejandro.munyoz@gmail.com',
  'tndr.albertcf@gmail.com',
  'anaisabelhbz@gmail.com',
  'tndrcursos.albertoalonso@gmail.com',
  'aguilaelec@gmail.com',
  'andresmoba@yahoo.es',
  'antonia.lara99@gmail.com',
  'andresdelcastillo5221@gmail.com',
  'anhersan2004@hotmail.com',
  'maintenant123@gmail.com',
  'armando.nojo@gmail.com',
  'solymanantial@gmail.com',
  'anuskamp@hotmail.es',
  'anagoyanesvazquez@gmail.com',
  'andoni@yumemusic.es',
  'amalia-1508@hotmail.com',
  'a.mendibarre@hotmail.com',
  'tndrcursos.alexkizer@gmail.com',
  'yanaraterapias@gmail.com',
  'escricheroyoangela@gmail.com',
  'amparisky@gmail.com',
  'andreabufanio@hotmail.com',
  'nutricion.amaia@gmail.com',
  'contacto@almaruiznaturopatia.com',
  'andosudupe@gmail.com',
  'peralesb@hotmail.es',
  'musilla_@hotmail.com',
  'dasaoc91@gmail.com',
  'kino34130@hotmail.com',
  'dariaszubska@onet.eu',
  'braulia.l@hotmail.com',
  'aurora-ari@hotmail.com',
  'christianschnack1971@gmail.com',
  'csobron57@gmail.com',
  'beatrizalcivarmolina@hotmail.es',
  'ortizderoabeatriz33@gmail.com',
  'fideofrio@hotmail.com',
  'tndrcursos.carlosrojo@gmail.com',
  'claudiamra6@hotmail.com',
  'vueloalinfinito1@gmail.com',
  'ctc@movistar.es',
  'pricelena@gmail.com',
  'asierid88@gmail.com',
  'beatriztt@hotmail.com',
  'ssatglass@gmail.com',
  'beatriz.ros.diaz@gmail.com',
  'ddgaraio@gmail.com',
  'bommes.ppm@t-online.de',
  'baizpuruar@gmail.com',
  'firachecarmen@gmail.com',
  'bessy.scholz@yahoo.com',
  'elihenaop@icloud.com',
  'elenasanmarhunting@gmail.com',
  'andiel666@hotmail.com',
  'elisasegar@gmail.com',
  'garabatoscolmenar@eigarabatos.com',
  'alonsoelena5@gmail.com',
  'dumenech@telefonica.net',
  'helenalarioja@hotmail.com',
  'loli.medinajimena@gmail.com',
  'diegocansino@gmail.com',
  'jaelgon62@hotmail.com',
  'coraljisa@yahoo.es',
  'quiroz.06@hotmail.com',
  'dannypizzio@gmail.com',
  'tndrcursos.auroralopez@gmail.com',
  'darwin010390xxx@gmail.com',
  'tndrcursos.carmensainzmaza@gmail.com',
  'chon.herreros@gmail.com',
  'mimulus70@gmail.com',
  'clunivios@hotmail.com',
  'tndr.martin@gmail.com',
  'dositeomouriz@gmail.com',
  'coope.emilia@gmail.com',
  'estherortizdezarate@gmail.com',
  'tzilayeva@gmail.com',
  'fernando.martinez.ciria@gmail.com',
  'esterlupion@gmail.com',
  'eliebana@gmail.com',
  'reyes.harold@gmail.com',
  'ernesliria@gmail.com',
  'emi.2.jg@gmail.com',
  'arteyogainesgaran@gmail.com',
  'fernando@golmayo.com',
  'angelinsideyou@gmail.com',
  'elvirahvedia2@gmail.com',
  'isafersar@hotmail.com',
  'fabiolasilvaramos@yahoo.com.br',
  'irunebonillai@gmail.com',
  'gusrafmr@icloud.com',
  'nathanfer@yahoo.fr',
  'tndrcursos.glorialeon@gmail.com',
  'ester.tndr@gmail.com',
  'namaskar.eva@gmail.com',
  'giulio.cappelletti@gmx.com',
  'scarlatamp@gmail.com',
  'tndrcursos.hanielperez@gmail.com',
  'formacion@celtilabnatura.com',
  'jsujn@yahoo.es',
  'santaclarapiso@outlook.es',
  'gmateo10@gmail.com',
  'finarey2012@hotmail.com',
  'pma061@gmail.com',
  'iratxebarrutieta@gmail.com',
  'fespinalpastor@gmail.com',
  'i.uriarte.i@hotmail.com',
  'zackiano@gmail.com',
  'tndrcursos.iratxedelafuente@gmail.com',
  'hanielpg@icloud.com',
  'isalcu74@icloud.com',
  'ilargifisioterapia@gmail.com',
  'tndrcursos.hectormartin@gmail.com',
  'gondragon8@yahoo.es',
  'iwonajarnecka@gmail.com',
  'isabel_yolanda1948@hotmail.com',
  'tndrcursos.joseantoniomontes@gmail.com',
  'pitzi.17@gmail.com',
  'jlabascalcarranza@gmail.com',
  'jmtorr4@gmail.com',
  'iulianabadiu86@yahoo.com',
  'jarego@live.com',
  'divulgadortelematico@gmail.com',
  'los_buitrago@hotmail.com',
  'jramosbe84@gmail.com',
  'elcambiotb@gmail.com',
  'jooree86@hotmail.com',
  'juanjoquevedo@gmail.com',
  'jcgarve@yahoo.com',
  'jaioneoyarzabal@yahoo.com.ar',
  'jtorres.tndr@gmail.com',
  'jsmsober@hotmail.com',
  'jcacera@gmail.com',
  'hacianuevasdirecciones@gmail.com',
  'juancsanmartinrodriguez@gmail.com',
  'laila.aranda.romero@gmail.com',
  'jjrigat@gmail.com',
  'laurags_90@hotmail.com',
  'ldelpozoa@gmail.com',
  'garvarlu@gmail.com',
  'm.glorialeonruiz@gmail.com',
  'zongolfo@gmail.com',
  'navajo_vega43@hotmail.com',
  'gmarian117@gmail.com',
  'lolird@hotmail.com',
  'lafdez13@gmail.com',
  'lorenatoquero.r@gmail.com',
  'tndrcursos.maitealtonaga@gmail.com',
  'lauratndr@gmail.com',
  'maite.archena@hotmail.com',
  'lorenamirandagg@gmail.com',
  'ortegaodenamanoli@gmail.com',
  'punte961@gmail.com',
  'bigorramar@gmail.com',
  'balust@hotmail.com',
  'aviladasilveira@gmail.com',
  'tertontndr@gmail.com',
  'harigatosan@gmail.com',
  'mangelesllorente@hotmail.com',
  'info.psime@gmail.com',
  'perarnaumaribel@gmail.com',
  'labrisadelamor@gmail.com',
  'asenfm@gmail.com',
  'maria.eugenia.saez52@gmail.com',
  'isabeltndr@esticpertu.es',
  'lurdes.navas@yahoo.es',
  'circulomaria77@gmail.com',
  'mariasanromagabas@gmail.com',
  'mariangelsrigat@yahoo.es',
  'maritxuvferreiro@gmail.com',
  'mmartorrents@hotmail.com',
  'mbayonacirbian@gmail.com',
  'lomarlen@gmail.com',
  'marisa@marialuisasotes.com',
  'mj.sanz.ruiz@hotmail.es',
  'mjac111@gmail.com',
  'casaserra10@hotmail.com',
  'marinoprietogonzalez@gmail.com',
  'mjnadalb@hotmail.com',
  'marialuisaranzadi@hotmail.com',
  'nessaymas@gmail.com',
  'mnovales9@gmail.com',
  'merceechevers@gmail.com',
  'maya.liebana@gmail.com',
  'marta@lagaleriasa.com',
  'maribelmanga@yahoo.es',
  'maryaguilar_barrera@hotmail.com',
  'martamokano@gmail.com',
  'mercedes_rios@hotmail.es',
  'craneosacral21659@gmail.com',
  'mayelaparra29@gmail.com',
  'm.abadjim@hotmail.com',
  'mertxegranenaescorihuela@gmail.com',
  'martin_f_ortiz@yahoo.com.mx',
  'tndrcursos.miguelangelalvarez@gmail.com',
  'marioiram@gmail.com',
  'maxvaloria@gmail.com',
  'tndrcursos.mercedesrios@gmail.com',
  'mpmraquel7@gmail.com',
  'malp2008@gmail.com',
  'monica.castells.fernandez@gmail.com',
  'murriaz@gmail.com',
  'miriamnicolasolivera@hotmail.com',
  'alexnuriacanovas@gmail.com',
  'monica.ageacac@gmail.com',
  'm_lgracia@msn.com',
  'cim.monica15@gmail.com',
  'herrera.myrna@gmail.com',
  'mirenurka@gmail.com',
  'montse.garciav@gmail.com',
  'nereaceae85@gmail.com',
  'liliguapacha@hotmail.com',
  'nincm83@hotmail.com',
  'nachalopezcuevas@gmail.com',
  'jegamu66@hotmail.com',
  'nicolaspsanmartin@gmail.com',
  'nnkm65@hotmail.com',
  'orlando.gallegos.019@gmail.com',
  'nere_gali@hotmail.com',
  'nuriagbartolome@gmail.com',
  'nufoda33@gmail.com',
  'tndrcursos.orlandogallegos@gmail.com',
  'paupperez@gmail.com',
  'sanchezalgaba@gmail.com',
  'patricia.echevarria.ruiz@gmail.com',
  'patximartin75@gmail.com',
  'paulaest2@hotmail.com',
  'tndrcursos.pazgarcia@gmail.com',
  'hermitagecentre@gmail.com',
  'm.pazgarciasola@gmail.com',
  'ppozzato7@gmail.com',
  'psantistebandiez@gmail.com',
  'pedrojperello@gmail.com',
  'w_moctezuma@hotmail.com',
  'pedrobayod@gmail.com',
  'pabloguerrago@yahoo.es',
  'priscilaochoaleon@gmail.com',
  'rafaevolutivo@gmail.com',
  'prathnakaur@hotmail.com',
  'poly20san@hotmail.com',
  'ralpilopez@gmail.com',
  'snnssy-77@hotmail.co.jp',
  '26500.ro@gmail.com',
  'infostdc@gmail.com',
  'rolandosanmar@yahoo.es',
  'rebecagreciano@gmail.com',
  'sandraricart@hotmail.es',
  'rcmarcuartu@gmail.com',
  'rutrevueltaleon@gmail.com',
  'erqueiq81@hotmail.com',
  'rbnmoral@gmail.com',
  'adinar2000@yahoo.es',
  'enyahrosa@gmail.com',
  'raimonda19661210@hotmail.com',
  'soniacarcer@hotmail.com',
  'snadal.90@hotmail.es',
  'agatainti1958@gmail.com',
  'saraliebana@yahoo.es',
  'shegasa@gmail.com',
  'adry_villa@hotmail.com',
  'tndrcursos.silviabaars@gmail.com',
  'silviapesado@hotmail.com',
  'simonasbeconis@gmail.com',
  'sara.salinas@gmail.com',
  'seequilibrium@gmail.com',
  'shirley.univio@gmail.com',
  'sergiogondel80@gmail.com',
  'xexi_469@hotmail.com',
  'sergimunozmunoz@gmail.com',
  'solekny@hotmail.com',
  'silviamvindel@gmail.com',
  'rodrigo.marsan05@gmail.com',
  'susana.ferre83@gmail.com',
  'claupauda75@yahoo.es',
  'patricastaneda.correos@yahoo.es',
  'soniarubia22@hotmail.com',
  'elgaia@tinet.cat',
  'ssj35@hotmail.es',
  'susansilvero36@gmail.com',
  's.toyas@hotmail.com',
  'mejiassol@gmail.com',
  'verodehoyos@gmail.com',
  'anagalsol@gmail.com',
  'beamaestro@protonmail.com',
  'desi.millan@gmail.com',
  'klga.alejandro@gmail.com',
  'enfirme@gmail.com',
  'txalsmm@gmail.com',
  'tndrcursos.davidmolina@gmail.com',
  'eddy_264@hotmail.com',
  'cristina_mon@hotmail.com',
  'edurne_14@hotmail.es',
  'cristinaaurea@icloud.com',
  'antonia-milagros@hotmail.com',
  'ebllano@hotmail.com',
  'greysyvascomontoya@gmail.com',
  'taniuskaboris@gmail.com',
  'tndrcursos.tamarasanmartin@gmail.com',
  'callebejar666@hotmail.com',
  'tomas.antolin@hotmail.com',
  'tania.pereira.mendez@gmail.com',
  'mssvero7@gmail.com',
  'vicen-buigues@hotmail.com',
  'tiagoabascal.v@gmail.com',
  'fernandezdelahozvidal@gmail.com',
  'vanesarnau@gmail.com',
  'jingvet@gmail.com',
  'yoyo3065@gmail.com',
  'xavierbarcelo@hotmail.com',
  'xavigrana2@hotmail.com',
  'aquiyahoraesperfecto@gmail.com',
  'begrazu@gmail.com',
  'yolandagd77@hotmail.com',
  'ximena.alvarez@web.de',
  'valentina.stuardoaes@gmail.com',
  'v.lopez.talavera@gmail.com',
  'glorialopezgarciademarina@hotmail.com',
  'ismoga78@gmail.com',
  'joluel56@hotmail.com',
  'glessan83@gmail.com',
  'mdd.delgado.galdos@gmail.com',
  'mamavivi.coria@gmail.com',
  'mikibilbao@gmail.com',
  'pablo.larras@gmail.com',
  'amarillo44@gmail.com',
  'marilenablumer1944@gmail.com',
  'tndrcursos.finareygarcia@gmail.com',
  'izaskuntndr@gmail.com',
  'jmiguelsuarez@gmail.com',
  'garcicasjuajgc12@gmail.com',
  'pvelasc@gmail.com',
  'jfukuan@gmail.com',
  'mjgomezlazaro@gmail.com',
  'miremassu@gmail.com',
  'iridologos@hotmail.com',
  'vanelaza80@gmail.com',
  'jjaamontes@gmail.com',
  'g.josefina700@gmail.com',
  'gabrielunivio@gmail.com',
  'masespronceda@gmail.com',
  'eliobeli@hotmail.com',
  'miguelyanalarragueta@hotmail.com',
  'miguelangelm73@gmail.com',
  'oliviaaguilarterapias@gmail.com',
  '670799376a@gmail.com',
  'sarayrevuelta@gmail.com',
  'sofibiel8@gmail.com',
  'victoriavelezr@hotmail.com',
  'tonibc-9@hotmail.com',
  'maicamicra@gmail.com',
  'susilandia1@gmail.com',
  'tndrcursos.monicabarboza@gmail.com',
  'topitobellvi@hotmail.com',
  'medicinayosteopatia@gmail.com',
  'renacersconsciente@gmail.com',
  'julenaldaiquintero88@gmail.com',
  'maria@fengshui.es',
  'mirian.mesuro@gmail.com',
  'monitime@hotmail.com',
  'sandra.eusk@gmail.com',
  'saioame@hotmail.com',
  'afernandezg@outlook.es',
  'lolatndr@gmail.com',
  'txusilla7@hotmail.com',
  'moma1971@gmail.com',
  'rapaquelpe1@hotmail.com',
  'sgunning@netlanguages.com',
  'thib.delbrouck@gmail.com',
  'yajaira.almeida@live.com',
  'utisantamaria@gmail.com',
  'luisma3f@gmail.com',
  'mirabilys@hotmail.com',
  'noemi@aciertaformacion.es',
  'zulmasecuelo@gmail.com',
  'mjsetien83@gmail.com',
  'priosol1@hotmail.com',
  'univio_22@hotmail.com',
  'ainosbcn@hotmail.com',
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function supabaseAuthHeaders() {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  };
}

function supabaseRestHeaders() {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  };
}

/** Crea un usuario en Supabase Auth. Devuelve { id, alreadyExists }. */
async function createUser(email) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: supabaseAuthHeaders(),
    body: JSON.stringify({
      email,
      password: TEMP_PASSWORD,
      email_confirm: true,
    }),
  });

  if (res.status === 422) {
    const body = await res.json();
    const msg = body?.msg ?? body?.message ?? JSON.stringify(body);
    if (/already registered|already been registered|already exists/i.test(msg)) {
      return { id: null, alreadyExists: true };
    }
    throw new Error(`422 al crear ${email}: ${msg}`);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Error ${res.status} al crear ${email}: ${body}`);
  }

  const data = await res.json();
  return { id: data.id, alreadyExists: false };
}

/** Asigna el rol de alumno al user_id en customer_role_assignments. */
async function assignRole(userId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/customer_role_assignments`, {
    method: 'POST',
    headers: supabaseRestHeaders(),
    body: JSON.stringify({ user_id: userId, role_id: ROLE_ID }),
  });

  // 409 Conflict = ya tiene el rol asignado → no es error
  if (res.status === 409) return;

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Error ${res.status} asignando rol a ${userId}: ${body}`);
  }
}

/** Envía el email de bienvenida vía Resend. */
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
    throw new Error(`Error ${res.status} enviando email a ${email}: ${body}`);
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
<title>Tu espacio en la Tienda TNDR</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin:0; padding:0; background:#f0ebe0; font-family:'Poppins', Arial, sans-serif;">

<div style="display:none; max-height:0; overflow:hidden; opacity:0;">
Algo especial para quienes llevan años caminando junto a nosotros · Tienda TNDR
</div>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0ebe0;">
<tr>
<td align="center" style="padding:30px 12px;">

<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 12px 40px rgba(0,0,0,0.07);">

<!-- HEADER -->
<tr>
<td style="background:#3d5c3a; padding:28px 30px 24px 30px;">
  <div style="font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#a8c4a5; font-weight:600; margin-bottom:10px;">
    TNDR · Para nuestros alumnos
  </div>
  <div style="font-size:28px; color:#ffffff; font-weight:800; line-height:1.25;">
    Algo especial<br>para ti.
  </div>
</td>
</tr>

<!-- BANDA -->
<tr>
<td style="background:#e8e0d0; padding:12px 30px;">
  <div style="font-size:13px; color:#3d5c3a; font-weight:600;">
    ✦ &nbsp;Alumno/a TNDR · Acceso especial a la tienda
  </div>
</td>
</tr>

<!-- CUERPO -->
<tr>
<td style="padding:34px 30px 24px 30px; color:#2a3a28; font-size:16px; line-height:1.8;">

  <p style="font-size:22px; font-weight:800; color:#3d5c3a; margin:0 0 20px 0; line-height:1.3;">
    Han pasado años.<br>Y aún seguís aquí.
  </p>

  <p style="margin:0 0 18px 0;">
    Durante todo este tiempo, cientos de alumnos habéis formado parte de la metodología TNDR. Habéis aprendido, practicado y crecido junto a nosotros. Eso no se olvida.
  </p>

  <p style="margin:0 0 18px 0;">
    Precisamente por eso, queremos empezar a <strong>devolveros parte de ese valor</strong>. Hemos creado un espacio propio para vosotros dentro de nuestra tienda online oficial, con condiciones pensadas específicamente para la familia TNDR.
  </p>

</td>
</tr>

<!-- CREDENCIALES -->
<tr>
<td style="padding:0 30px 28px 30px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f0e8; border-radius:14px; border-left:4px solid #3d5c3a;">
    <tr>
      <td style="padding:24px 28px;">
        <div style="font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:#3d5c3a; font-weight:700; margin-bottom:16px;">Tus datos de acceso</div>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding:8px 0; font-size:14px; color:#6b7a68; width:120px;">Email</td>
            <td style="padding:8px 0; font-size:15px; color:#2a3a28; font-weight:600;">${email}</td>
          </tr>
          <tr>
            <td colspan="2" style="border-top:1px solid #ddd5c5; padding:0;"></td>
          </tr>
          <tr>
            <td style="padding:8px 0; font-size:14px; color:#6b7a68;">Contraseña</td>
            <td style="padding:8px 0;">
              <span style="background:#3d5c3a; color:#ffffff; font-size:14px; font-weight:700; padding:6px 14px; border-radius:6px; letter-spacing:0.3px;">${TEMP_PASSWORD}</span>
            </td>
          </tr>
        </table>
        <div style="margin-top:14px; font-size:13px; color:#8a9a88;">
          Te recomendamos cambiar tu contraseña tras el primer acceso desde tu perfil.
        </div>
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- VENTAJAS -->
<tr>
<td style="padding:0 30px 28px 30px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f0e8; border-radius:14px;">
    <tr>
      <td style="padding:22px 24px;">
        <div style="font-size:11px; font-weight:700; color:#3d5c3a; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:14px;">
          Tu cuenta Alumno TNDR incluye
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:7px 0; font-size:15px; color:#2a3a28;">
              🌿 &nbsp;<strong>15% de descuento permanente</strong> en fórmulas magistrales y productos TNDR
            </td>
          </tr>
          <tr>
            <td style="padding:7px 0; font-size:15px; color:#2a3a28;">
              🔑 &nbsp;Perfil personal con <strong>historial de pedidos</strong>
            </td>
          </tr>
          <tr>
            <td style="padding:7px 0; font-size:15px; color:#2a3a28;">
              📦 &nbsp;Descuento aplicado <strong>automáticamente</strong>, sin códigos
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- CTA -->
<tr>
<td align="center" style="padding:0 30px 36px 30px;">
  <a href="${TIENDA_URL}" style="background:#3d5c3a; color:#ffffff; text-decoration:none; font-weight:700; font-size:16px; padding:16px 40px; border-radius:999px; display:inline-block; letter-spacing:0.3px;">
    Acceder a la Tienda TNDR →
  </a>
</td>
</tr>

<!-- AVISO SPAM -->
<tr>
<td style="padding:0 30px 30px 30px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fdf8ee; border-radius:14px; border:1px dashed #c8b87a;">
    <tr>
      <td style="padding:18px 22px; font-size:14px; color:#6b5a20; line-height:1.7;">
        <strong>⚠️ Importante:</strong><br>
        — Usa exactamente el email al que has recibido este correo para entrar.<br>
        — Si tienes cualquier problema para acceder, escríbenos a <a href="mailto:tienda@tndr.eu" style="color:#3d5c3a; font-weight:600;">tienda@tndr.eu</a>
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- SEPARADOR -->
<tr>
<td style="padding:0 30px;">
  <div style="border-top:1px solid #e8e0d0;"></div>
</td>
</tr>

<!-- LO QUE VIENE -->
<tr>
<td style="padding:28px 30px 10px 30px; color:#2a3a28; font-size:16px; line-height:1.8;">
  <p style="font-size:18px; font-weight:800; color:#3d5c3a; margin:0 0 14px 0;">
    Y esto es solo el principio.
  </p>
  <p style="margin:0 0 18px 0;">
    Estamos estructurando nuevas figuras dentro de TNDR para quienes quieran implicarse más profundamente en el proyecto. Cada una con sus propias ventajas, acceso prioritario y condiciones especiales:
  </p>
</td>
</tr>

<!-- TRES FIGURAS -->
<tr>
<td style="padding:0 30px 30px 30px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate; border-spacing:0 8px;">
    <tr>
      <td style="background:#f5f0e8; border-radius:12px; padding:16px 20px;">
        <div style="font-size:16px; font-weight:800; color:#3d5c3a;">🌿 Profesional TNDR</div>
        <div style="font-size:13px; color:#6b7a68; margin-top:4px;">Para quienes ejercen la metodología en consulta o práctica profesional.</div>
      </td>
    </tr>
    <tr><td style="height:8px; background:transparent;"></td></tr>
    <tr>
      <td style="background:#f5f0e8; border-radius:12px; padding:16px 20px;">
        <div style="font-size:16px; font-weight:800; color:#3d5c3a;">🤝 Asociado TNDR</div>
        <div style="font-size:13px; color:#6b7a68; margin-top:4px;">Para quienes quieren crecer junto al proyecto con implicación activa.</div>
      </td>
    </tr>
    <tr><td style="height:8px; background:transparent;"></td></tr>
    <tr>
      <td style="background:#f5f0e8; border-radius:12px; padding:16px 20px;">
        <div style="font-size:16px; font-weight:800; color:#3d5c3a;">🌀 Embajador TNDR</div>
        <div style="font-size:13px; color:#6b7a68; margin-top:4px;">Para quienes difunden y representan los valores TNDR en su entorno.</div>
      </td>
    </tr>
  </table>
  <p style="margin:18px 0 0 0; font-size:14px; color:#8a9a88; line-height:1.7;">
    Todavía estamos terminando de estructurar el sistema, pero si tienes interés en alguna de estas figuras, <strong style="color:#3d5c3a;">escríbenos directamente</strong> y te informamos en persona.
  </p>
</td>
</tr>

<!-- COMPARTIR -->
<tr>
<td style="padding:0 30px 36px 30px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#3d5c3a; border-radius:14px;">
    <tr>
      <td style="padding:20px 24px; font-size:15px; color:#d4e8d0; line-height:1.7; text-align:center;">
        📲 &nbsp;<strong style="color:#ffffff;">¿Conoces a algún compañero/a de formación</strong> que ya no esté en los grupos?<br>
        <span style="font-size:14px;">Comparte este mensaje para que también puedan estar atentos al correo.</span>
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- FIRMA -->
<tr>
<td style="padding:0 30px 36px 30px; border-top:1px solid #e8e0d0;">
  <table cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
    <tr>
      <td>
        <div style="font-size:15px; color:#2a3a28;">Un abrazo,</div>
        <div style="font-size:19px; font-weight:800; color:#3d5c3a; margin-top:6px;">Héctor Martín Tío</div>
        <div style="font-size:13px; color:#6b8a68; margin-top:2px;">Director de TNDR · Sistema Integrativo de Salud, Formación y Desarrollo</div>
        <div style="margin-top:8px;">
          <a href="mailto:tienda@tndr.eu" style="color:#3d5c3a; font-size:13px; text-decoration:none; font-weight:600;">tienda@tndr.eu</a>
        </div>
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td align="center" style="background:#f0ebe0; padding:22px 24px; border-top:1px solid #ddd5c5;">
  <div style="font-size:12px; color:#8a7a5a; line-height:1.6;">
    Recibes este email por haber sido alumno/a de formaciones TNDR.
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
  console.log(`  Alta masiva Alumnos TNDR – tienda.tndr.eu`);
  if (DRY_RUN) console.log('  ⚠️  MODO DRY-RUN: no se harán cambios reales');
  console.log(`  ${EMAILS.length} alumnos a procesar`);
  console.log(`${'─'.repeat(60)}\n`);

  const results = { created: [], skipped: [], errors: [] };

  for (let i = 0; i < EMAILS.length; i++) {
    const email = EMAILS[i];
    const tag   = `[${String(i + 1).padStart(3, '0')}/${EMAILS.length}] ${email}`;

    try {
      if (DRY_RUN) {
        console.log(`  ✅ ${tag} → creado (simulado)`);
        console.log(`  📧 ${tag} → email enviado (simulado)`);
        results.created.push(email);
        continue;
      }

      // 1. Crear usuario
      const { id: userId, alreadyExists } = await createUser(email);

      if (alreadyExists) {
        console.log(`  ⏭️  ${tag} → ya existe (omitido)`);
        results.skipped.push(email);
        continue;
      }

      console.log(`  ✅ ${tag} → usuario creado`);

      // 2. Asignar rol
      await assignRole(userId);
      console.log(`  🏷️  ${tag} → rol asignado`);

      // 3. Enviar email
      await sendWelcomeEmail(email);
      console.log(`  📧 ${tag} → email enviado`);

      results.created.push(email);
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
  console.log(`  ✅ Creados y notificados   : ${results.created.length}`);
  console.log(`  ⏭️  Ya existían (omitidos)  : ${results.skipped.length}`);
  console.log(`  ❌ Errores                 : ${results.errors.length}`);

  if (results.skipped.length > 0) {
    console.log('\n  Omitidos (ya existían):');
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
