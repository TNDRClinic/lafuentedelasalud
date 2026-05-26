#!/usr/bin/env node
/**
 * Actualización masiva de alumnos TNDR:
 *  1. Pone nombre + apellido en user_metadata de Supabase Auth
 *  2. Re-asigna el rol Alumno TNDR en customer_role_assignments (upsert)
 *
 * Uso:
 *   node scripts/actualizar-alumnos-tndr.mjs
 *   node scripts/actualizar-alumnos-tndr.mjs --dry-run
 */

const DRY_RUN    = process.argv.includes('--dry-run');
const SUPABASE_URL = 'https://oczxcsymcqjvibjltfrw.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ROLE_ID      = '36d48bae-4fec-4657-9c99-014ec4541981';
const DELAY_MS     = 200;

// email → { first_name, last_name }
const ALUMNOS = [
  { email: 'amador.p.a.123@gmail.com', first_name: 'Amador', last_name: 'Pérez Aranda' },
  { email: 'enesenciaherbolario@gmail.com', first_name: 'Alejandra', last_name: 'Prada Sánchez' },
  { email: 'amalisaibaha@gmail.com', first_name: 'Amali', last_name: 'Saibaha' },
  { email: 'aplantalamor@yahoo.es', first_name: 'Álvaro', last_name: 'Plantalamor Enríquez' },
  { email: 'agustinbcn@yahoo.es', first_name: 'Agustín', last_name: 'Martínez' },
  { email: 'aguitar1723@gmail.com', first_name: 'Adrián', last_name: 'Jalón Serrano' },
  { email: 'abelguzman33@hotmail.com', first_name: 'Abel', last_name: 'Guzmán Domínguez' },
  { email: 'alex.garci@hotmail.com', first_name: 'Alex', last_name: 'García' },
  { email: 'tndrcursos.andresmendizabal@gmail.com', first_name: 'Andrés', last_name: 'Mendizabal' },
  { email: 'aidagargas@hotmail.com', first_name: 'Aida', last_name: 'García Gasco' },
  { email: 'alexsanchezcoca@gmail.com', first_name: 'Alex', last_name: 'Sanchez' },
  { email: 'alexandradegomez83@gmail.com', first_name: 'Alejandro', last_name: 'Andrade Gómez' },
  { email: 'am.pedrazagiron@gmail.com', first_name: 'Alba', last_name: 'Pedraza Girón' },
  { email: 'aidalopezvalcarce@gmail.com', first_name: 'Aida', last_name: 'López Valcarce' },
  { email: 'aniyjosecarlos@hotmail.com', first_name: 'Ana', last_name: 'Isabel Vázquez Rodríguez' },
  { email: 'tndrcursos.aliciarevilla@gmail.com', first_name: 'Alicia', last_name: 'Revilla' },
  { email: 'alexkizer2547@gmail.com', first_name: 'Aliaksandr', last_name: 'Kizer' },
  { email: 'ajrigat@gmail.com', first_name: 'Alexandra', last_name: 'Jiménez Rigat' },
  { email: 'anaigles@hotmail.com', first_name: 'Ana', last_name: 'Iglesias Blasi' },
  { email: 'aranmg76@gmail.com', first_name: 'Aránzazu', last_name: 'Martínez González' },
  { email: 'annampajares@hotmail.com', first_name: 'Ana', last_name: 'María Pajares Rebolleda' },
  { email: 'alejandro.munyoz@gmail.com', first_name: 'Alejandro', last_name: 'Muñoz Fortuño' },
  { email: 'tndr.albertcf@gmail.com', first_name: 'Albert', last_name: 'Castillo Fuster' },
  { email: 'anaisabelhbz@gmail.com', first_name: 'Ana', last_name: 'Isabel Hernández Blazquez' },
  { email: 'tndrcursos.albertoalonso@gmail.com', first_name: 'Alberto', last_name: 'Alonso' },
  { email: 'aguilaelec@gmail.com', first_name: 'Alba', last_name: 'Yurani Torres Espinosa' },
  { email: 'andresmoba@yahoo.es', first_name: 'Andres', last_name: 'Morales Balbin' },
  { email: 'antonia.lara99@gmail.com', first_name: 'Antonia', last_name: 'Lara Ochoa' },
  { email: 'andresdelcastillo5221@gmail.com', first_name: 'Andrés', last_name: 'del Castillo' },
  { email: 'anhersan2004@hotmail.com', first_name: 'Ana', last_name: 'Herrera Santorum' },
  { email: 'maintenant123@gmail.com', first_name: 'Ane', last_name: 'Begoña Pérez Conde' },
  { email: 'armando.nojo@gmail.com', first_name: 'Armando', last_name: 'Nogueron Jordan' },
  { email: 'solymanantial@gmail.com', first_name: 'Alfredo', last_name: 'Abascal Albernaz' },
  { email: 'anuskamp@hotmail.es', first_name: 'Ana', last_name: 'María Martín Puertas' },
  { email: 'anagoyanesvazquez@gmail.com', first_name: 'Ana', last_name: 'Goyanes Vazquez' },
  { email: 'andoni@yumemusic.es', first_name: 'Andoni', last_name: 'Leiva Reyes' },
  { email: 'amalia-1508@hotmail.com', first_name: 'Amalia', last_name: 'Ruiz Blanca' },
  { email: 'a.mendibarre@hotmail.com', first_name: 'Andrés', last_name: 'Mendizabal' },
  { email: 'tndrcursos.alexkizer@gmail.com', first_name: 'Aliaksandr', last_name: 'Kizer' },
  { email: 'yanaraterapias@gmail.com', first_name: 'Alicia', last_name: 'Revilla García' },
  { email: 'escricheroyoangela@gmail.com', first_name: 'Ángela', last_name: 'Escribe Royo' },
  { email: 'amparisky@gmail.com', first_name: 'Amparo', last_name: 'Martínez Míguez' },
  { email: 'andreabufanio@hotmail.com', first_name: 'Andrea', last_name: 'Carina Bufanio Alonso' },
  { email: 'nutricion.amaia@gmail.com', first_name: 'Amaia', last_name: 'Tellería Elejoste' },
  { email: 'contacto@almaruiznaturopatia.com', first_name: 'Andrea', last_name: 'Ruiz López' },
  { email: 'andosudupe@gmail.com', first_name: 'Andoni', last_name: 'Sudupe Uria' },
  { email: 'peralesb@hotmail.es', first_name: 'Beatriz', last_name: 'Perales Escalona' },
  { email: 'musilla_@hotmail.com', first_name: 'Blanca', last_name: 'Bautista Pérez' },
  { email: 'dasaoc91@gmail.com', first_name: 'Daniel', last_name: 'Sanchez Ochoa' },
  { email: 'kino34130@hotmail.com', first_name: 'David', last_name: 'Quinorero' },
  { email: 'dariaszubska@onet.eu', first_name: 'Daría', last_name: 'Szubska' },
  { email: 'braulia.l@hotmail.com', first_name: 'Braulia', last_name: 'León Ortiz' },
  { email: 'aurora-ari@hotmail.com', first_name: 'Aurora', last_name: 'López Fernández' },
  { email: 'christianschnack1971@gmail.com', first_name: 'Christian', last_name: 'Schnack' },
  { email: 'csobron57@gmail.com', first_name: 'Carmen', last_name: 'Sobrón García' },
  { email: 'beatrizalcivarmolina@hotmail.es', first_name: 'Beatriz', last_name: 'Alcivar Molina' },
  { email: 'ortizderoabeatriz33@gmail.com', first_name: 'Beatriz', last_name: 'Ortiz de Roa' },
  { email: 'fideofrio@hotmail.com', first_name: 'Bettina', last_name: 'Natalia Aguiñaga Aguirregaray' },
  { email: 'tndrcursos.carlosrojo@gmail.com', first_name: 'Carlos', last_name: 'Rojo' },
  { email: 'claudiamra6@hotmail.com', first_name: 'Claudia', last_name: 'Ramirez Acevedo' },
  { email: 'vueloalinfinito1@gmail.com', first_name: 'Carmen', last_name: 'Sainz-Maza Ruiz-Canales' },
  { email: 'ctc@movistar.es', first_name: 'Carlos', last_name: 'Torres Corvinos' },
  { email: 'pricelena@gmail.com', first_name: 'Elena', last_name: 'Ros Díaz' },
  { email: 'asierid88@gmail.com', first_name: 'Asier', last_name: 'Ibarra Duque' },
  { email: 'beatriztt@hotmail.com', first_name: 'Beatriz', last_name: 'Torres Torres' },
  { email: 'ssatglass@gmail.com', first_name: 'Dossou', last_name: 'Saturnn Houndegla' },
  { email: 'beatriz.ros.diaz@gmail.com', first_name: 'Beatriz', last_name: 'Ros Diaz' },
  { email: 'ddgaraio@gmail.com', first_name: 'Dionisio', last_name: 'Díaz de Garayo' },
  { email: 'bommes.ppm@t-online.de', first_name: 'Christoph', last_name: 'Bommes' },
  { email: 'baizpuruar@gmail.com', first_name: 'Beatriz', last_name: 'Aizpuría Ramírez' },
  { email: 'firachecarmen@gmail.com', first_name: 'Carmen', last_name: 'Firache' },
  { email: 'bessy.scholz@yahoo.com', first_name: 'Bessy', last_name: 'Arlette Yáñez Concha' },
  { email: 'elihenaop@icloud.com', first_name: 'Elizabeth', last_name: 'Henao Pérez' },
  { email: 'elenasanmarhunting@gmail.com', first_name: 'Elena', last_name: 'Sánchez Martín' },
  { email: 'andiel666@hotmail.com', first_name: 'Daniel', last_name: 'Molinó Ojeda' },
  { email: 'elisasegar@gmail.com', first_name: 'Elisa', last_name: 'Serrano García' },
  { email: 'garabatoscolmenar@eigarabatos.com', first_name: 'Elena', last_name: 'Romero Diez' },
  { email: 'alonsoelena5@gmail.com', first_name: 'Elena', last_name: 'Alonso González-Palacios' },
  { email: 'dumenech@telefonica.net', first_name: 'Carles', last_name: 'Domenech Santos' },
  { email: 'helenalarioja@hotmail.com', first_name: 'Elena', last_name: 'Albariño Blanes' },
  { email: 'loli.medinajimena@gmail.com', first_name: 'Dolores', last_name: 'Medina Jimena' },
  { email: 'diegocansino@gmail.com', first_name: 'Diego', last_name: 'Cansino Farfán' },
  { email: 'jaelgon62@hotmail.com', first_name: 'Elena', last_name: 'González Rodríguez' },
  { email: 'coraljisa@yahoo.es', first_name: 'Coral', last_name: 'Jimenez Sahagún' },
  { email: 'quiroz.06@hotmail.com', first_name: 'Claudia', last_name: 'Guadalupe Quiroz Guerrero' },
  { email: 'dannypizzio@gmail.com', first_name: 'Daniela', last_name: 'Carina Pizzio Baldesari' },
  { email: 'tndrcursos.auroralopez@gmail.com', first_name: 'Aurora', last_name: 'López' },
  { email: 'darwin010390xxx@gmail.com', first_name: 'Darwin', last_name: 'Heavy Ocampo Ramírez' },
  { email: 'tndrcursos.carmensainzmaza@gmail.com', first_name: 'Carmen', last_name: 'Sainz-Maza' },
  { email: 'chon.herreros@gmail.com', first_name: 'Chon', last_name: 'Herreros García' },
  { email: 'mimulus70@gmail.com', first_name: 'Cristina', last_name: 'Palomo Osa' },
  { email: 'clunivios@hotmail.com', first_name: 'Claudia', last_name: 'Univio' },
  { email: 'tndr.martin@gmail.com', first_name: 'Cayo', last_name: 'Martín Valencia' },
  { email: 'dositeomouriz@gmail.com', first_name: 'Dositeo', last_name: 'Mauriz López' },
  { email: 'coope.emilia@gmail.com', first_name: 'Emilia', last_name: 'Sánchez Amor' },
  { email: 'estherortizdezarate@gmail.com', first_name: 'Esther', last_name: 'Ortiz De Zarate' },
  { email: 'tzilayeva@gmail.com', first_name: 'Eva', last_name: 'María Urquijo Urquijo' },
  { email: 'fernando.martinez.ciria@gmail.com', first_name: 'Fernando', last_name: 'Martínez Sánchez' },
  { email: 'esterlupion@gmail.com', first_name: 'Ester', last_name: 'Lupion Porta' },
  { email: 'eliebana@gmail.com', first_name: 'Eva', last_name: 'Liébana Macho' },
  { email: 'reyes.harold@gmail.com', first_name: 'Harold', last_name: 'Reyes' },
  { email: 'ernesliria@gmail.com', first_name: 'Ernesto', last_name: 'Verdeguer Ortiz' },
  { email: 'emi.2.jg@gmail.com', first_name: 'Emilio', last_name: 'Jiménez García' },
  { email: 'arteyogainesgaran@gmail.com', first_name: 'Inés', last_name: 'García Antoñanzas' },
  { email: 'fernando@golmayo.com', first_name: 'Fernando', last_name: 'Golmayo' },
  { email: 'angelinsideyou@gmail.com', first_name: 'Iratxe', last_name: 'Blasco Gastesi' },
  { email: 'elvirahvedia2@gmail.com', first_name: 'Elvira', last_name: 'Hernandez Vedia' },
  { email: 'isafersar@hotmail.com', first_name: 'Isabel', last_name: 'Fernández Sánchez' },
  { email: 'fabiolasilvaramos@yahoo.com.br', first_name: 'Fabiola', last_name: 'Ramos' },
  { email: 'irunebonillai@gmail.com', first_name: 'Irune', last_name: 'Bonilla Ibáñez' },
  { email: 'gusrafmr@icloud.com', first_name: 'Gustavo', last_name: 'Montes de Oca' },
  { email: 'nathanfer@yahoo.fr', first_name: 'Fernand', last_name: 'Nathan' },
  { email: 'tndrcursos.glorialeon@gmail.com', first_name: 'Gloria', last_name: 'León' },
  { email: 'ester.tndr@gmail.com', first_name: 'Esther', last_name: 'Reverter Gamundi' },
  { email: 'namaskar.eva@gmail.com', first_name: 'Eva', last_name: 'Iglesias Montsech' },
  { email: 'giulio.cappelletti@gmx.com', first_name: 'Giulio', last_name: 'Cappelletti' },
  { email: 'scarlatamp@gmail.com', first_name: 'Isabel', last_name: 'María Martín Puertas' },
  { email: 'tndrcursos.hanielperez@gmail.com', first_name: 'Haniel', last_name: 'Pérez' },
  { email: 'formacion@celtilabnatura.com', first_name: 'Isabel', last_name: 'Piñeiro' },
  { email: 'jsujn@yahoo.es', first_name: 'Eva', last_name: 'María Perales Escalona' },
  { email: 'santaclarapiso@outlook.es', first_name: 'Isabel', last_name: 'Salaberria Gurruchaga' },
  { email: 'gmateo10@gmail.com', first_name: 'Gonzalo', last_name: 'Mateo Martínez' },
  { email: 'finarey2012@hotmail.com', first_name: 'Fina', last_name: 'Rey García' },
  { email: 'pma061@gmail.com', first_name: 'Francisco', last_name: 'Medina Amorós' },
  { email: 'iratxebarrutieta@gmail.com', first_name: 'Iratxe', last_name: 'Barrutieta Barandiaran' },
  { email: 'fespinalpastor@gmail.com', first_name: 'Frank', last_name: 'Espinal Pastor' },
  { email: 'i.uriarte.i@hotmail.com', first_name: 'Íñigo', last_name: 'Uriarte Ibargallartu' },
  { email: 'zackiano@gmail.com', first_name: 'Gabriel', last_name: 'Martín Tío' },
  { email: 'tndrcursos.iratxedelafuente@gmail.com', first_name: 'Iratxe', last_name: 'de la Fuente' },
  { email: 'hanielpg@icloud.com', first_name: 'Haniel', last_name: 'Pérez García' },
  { email: 'isalcu74@icloud.com', first_name: 'Isabel', last_name: 'Salcedo Cuevas' },
  { email: 'ilargifisioterapia@gmail.com', first_name: 'Ilargi', last_name: 'Duñabeitia Abendibar' },
  { email: 'tndrcursos.hectormartin@gmail.com', first_name: 'Héctor', last_name: 'G. Martín Tío' },
  { email: 'gondragon8@yahoo.es', first_name: 'Gonzalo', last_name: 'Zetina Romero' },
  { email: 'iwonajarnecka@gmail.com', first_name: 'Iwona', last_name: 'Jarnecka' },
  { email: 'isabel_yolanda1948@hotmail.com', first_name: 'Isabel', last_name: 'Yolanda González Llanquihuen' },
  { email: 'tndrcursos.joseantoniomontes@gmail.com', first_name: 'José', last_name: 'Antonio Montes' },
  { email: 'pitzi.17@gmail.com', first_name: 'Itziar', last_name: 'Rincón Ortiz' },
  { email: 'jlabascalcarranza@gmail.com', first_name: 'José', last_name: 'Luis Abascal Carranza' },
  { email: 'jmtorr4@gmail.com', first_name: 'José', last_name: 'María Torres Guerra' },
  { email: 'iulianabadiu86@yahoo.com', first_name: 'Iuliana', last_name: 'Alexandra Chiorcau' },
  { email: 'jarego@live.com', first_name: 'José', last_name: 'Antonio Rego Sanpedro' },
  { email: 'divulgadortelematico@gmail.com', first_name: 'Jose', last_name: 'Antonio Pascual Garcia' },
  { email: 'los_buitrago@hotmail.com', first_name: 'Josefa', last_name: 'Gamez Negrillo' },
  { email: 'jramosbe84@gmail.com', first_name: 'Javier', last_name: 'Ramos Berrocal' },
  { email: 'elcambiotb@gmail.com', first_name: 'Jésica', last_name: 'Valera Sánchez' },
  { email: 'jooree86@hotmail.com', first_name: 'Jose', last_name: 'Juan Castell Vargas' },
  { email: 'juanjoquevedo@gmail.com', first_name: 'Juanjo', last_name: 'Quevedo' },
  { email: 'jcgarve@yahoo.com', first_name: 'Juan', last_name: 'Carlos García Vecino' },
  { email: 'jaioneoyarzabal@yahoo.com.ar', first_name: 'Jaione', last_name: 'Oyarzabal Baraibar' },
  { email: 'jtorres.tndr@gmail.com', first_name: 'Juan', last_name: 'Antonio Torres Escámez' },
  { email: 'jsmsober@hotmail.com', first_name: 'Judith', last_name: 'Soberbio Muñoz' },
  { email: 'jcacera@gmail.com', first_name: 'Juan', last_name: 'Carlos Pérez Acera' },
  { email: 'hacianuevasdirecciones@gmail.com', first_name: 'Javaria', last_name: 'Zia' },
  { email: 'juancsanmartinrodriguez@gmail.com', first_name: 'Juan', last_name: 'Carlos Sanmartin Rodríguez' },
  { email: 'laila.aranda.romero@gmail.com', first_name: 'Laila', last_name: 'Aranda Romero' },
  { email: 'jjrigat@gmail.com', first_name: 'Joan', last_name: 'Jiménez Rigat' },
  { email: 'laurags_90@hotmail.com', first_name: 'Laura', last_name: 'García Sanz' },
  { email: 'ldelpozoa@gmail.com', first_name: 'Luis', last_name: 'Del Pozo Ajates' },
  { email: 'garvarlu@gmail.com', first_name: 'Lucia', last_name: 'García Varillas' },
  { email: 'm.glorialeonruiz@gmail.com', first_name: 'M. Gloria', last_name: 'León Ruiz' },
  { email: 'zongolfo@gmail.com', first_name: 'Laura', last_name: 'Bañuelos Villaverde' },
  { email: 'navajo_vega43@hotmail.com', first_name: 'Juan', last_name: 'Carlos Vega Navajo' },
  { email: 'gmarian117@gmail.com', first_name: 'Mª de los Ángeles', last_name: 'Gallardo Vila' },
  { email: 'lolird@hotmail.com', first_name: 'Mª Dolores', last_name: 'Rey Domínguez' },
  { email: 'lafdez13@gmail.com', first_name: 'Luis Ángel', last_name: 'Fernández Fernández' },
  { email: 'lorenatoquero.r@gmail.com', first_name: 'Lorena', last_name: 'Toquero Rodríguez' },
  { email: 'tndrcursos.maitealtonaga@gmail.com', first_name: 'Maite', last_name: 'Altonaga' },
  { email: 'lauratndr@gmail.com', first_name: 'Laura', last_name: 'López Arias' },
  { email: 'maite.archena@hotmail.com', first_name: 'Maite', last_name: 'Caro Estevez' },
  { email: 'lorenamirandagg@gmail.com', first_name: 'Lorena', last_name: 'Miranda Jiménez' },
  { email: 'ortegaodenamanoli@gmail.com', first_name: 'Manoli', last_name: 'Ortega Odena' },
  { email: 'punte961@gmail.com', first_name: 'Juan', last_name: 'Carlos González García' },
  { email: 'bigorramar@gmail.com', first_name: 'Mar', last_name: 'Bigorra' },
  { email: 'balust@hotmail.com', first_name: 'Maria', last_name: 'Balust Claverol' },
  { email: 'aviladasilveira@gmail.com', first_name: 'Luis', last_name: 'Silveira' },
  { email: 'tertontndr@gmail.com', first_name: 'Manuel', last_name: 'Roldan' },
  { email: 'harigatosan@gmail.com', first_name: 'María del Pilar', last_name: 'Agulla Castro' },
  { email: 'mangelesllorente@hotmail.com', first_name: 'María Ángeles', last_name: 'Llorente Marco' },
  { email: 'info.psime@gmail.com', first_name: 'Maria José', last_name: 'Domínguez Diaz' },
  { email: 'perarnaumaribel@gmail.com', first_name: 'Maria Isabel', last_name: 'Perarnau Ginesta' },
  { email: 'labrisadelamor@gmail.com', first_name: 'María Luisa', last_name: 'Canals Sempere' },
  { email: 'asenfm@gmail.com', first_name: 'María Ascensión', last_name: 'Fernández Millán' },
  { email: 'maria.eugenia.saez52@gmail.com', first_name: 'Maria Eugenia', last_name: 'Saez García' },
  { email: 'isabeltndr@esticpertu.es', first_name: 'María Isabel', last_name: 'Redondo Sánchez' },
  { email: 'lurdes.navas@yahoo.es', first_name: 'María Lourdes', last_name: 'Navas Martínez' },
  { email: 'circulomaria77@gmail.com', first_name: 'María', last_name: 'Martín Valencia' },
  { email: 'mariasanromagabas@gmail.com', first_name: 'Maria', last_name: 'Sanromà Gabàs' },
  { email: 'mariangelsrigat@yahoo.es', first_name: 'Mariangels', last_name: 'Rigat Martin' },
  { email: 'maritxuvferreiro@gmail.com', first_name: 'María Sol', last_name: 'Vázquez Ferreiro' },
  { email: 'mmartorrents@hotmail.com', first_name: 'María Carmen', last_name: 'Martínez Torrents' },
  { email: 'mbayonacirbian@gmail.com', first_name: 'Merche', last_name: 'Bayona' },
  { email: 'lomarlen@gmail.com', first_name: 'Marlen', last_name: 'López Campo' },
  { email: 'marisa@marialuisasotes.com', first_name: 'Marisa', last_name: 'Sotes Erostarbe' },
  { email: 'mj.sanz.ruiz@hotmail.es', first_name: 'María José', last_name: 'Sanz Ruiz' },
  { email: 'mjac111@gmail.com', first_name: 'Maria José', last_name: 'Andrés Cortés' },
  { email: 'casaserra10@hotmail.com', first_name: 'Maria Jesús', last_name: 'Barrera Hidalgo' },
  { email: 'marinoprietogonzalez@gmail.com', first_name: 'Marino', last_name: 'Prieto González' },
  { email: 'mjnadalb@hotmail.com', first_name: 'Maria José', last_name: 'Nadal Blanco' },
  { email: 'marialuisaranzadi@hotmail.com', first_name: 'Maria Luisa', last_name: 'de Aranzadi Pérez de Arenaza' },
  { email: 'nessaymas@gmail.com', first_name: 'Maria Vanesa', last_name: 'Bergua Beato' },
  { email: 'mnovales9@gmail.com', first_name: 'Marisa', last_name: 'Novales López' },
  { email: 'merceechevers@gmail.com', first_name: 'Mercedes', last_name: 'Henriquez de Echevers' },
  { email: 'maya.liebana@gmail.com', first_name: 'Maya', last_name: 'Liébana Macho' },
  { email: 'marta@lagaleriasa.com', first_name: 'Marta', last_name: 'Sotes Erostarbe' },
  { email: 'maribelmanga@yahoo.es', first_name: 'Maribel', last_name: 'Manga González' },
  { email: 'maryaguilar_barrera@hotmail.com', first_name: 'Mary', last_name: 'Aguilar Barrera' },
  { email: 'martamokano@gmail.com', first_name: 'Marta', last_name: 'Molina Cano' },
  { email: 'mercedes_rios@hotmail.es', first_name: 'Mercedes', last_name: 'de los Ríos Expósito' },
  { email: 'craneosacral21659@gmail.com', first_name: 'Marisa', last_name: 'Llanos Expósito' },
  { email: 'mayelaparra29@gmail.com', first_name: 'Mayela', last_name: 'Parra' },
  { email: 'm.abadjim@hotmail.com', first_name: 'Marina', last_name: 'Abad Jiménez' },
  { email: 'mertxegranenaescorihuela@gmail.com', first_name: 'Mertxe', last_name: 'Grañena Escorihuela' },
  { email: 'martin_f_ortiz@yahoo.com.mx', first_name: 'Martin Fernando', last_name: 'Ortiz García' },
  { email: 'tndrcursos.miguelangelalvarez@gmail.com', first_name: 'Miguel Ángel', last_name: 'Álvarez' },
  { email: 'marioiram@gmail.com', first_name: 'Mario', last_name: 'Villalba' },
  { email: 'maxvaloria@gmail.com', first_name: 'Max', last_name: 'Valoria Aguirre' },
  { email: 'tndrcursos.mercedesrios@gmail.com', first_name: 'Mercedes', last_name: 'Ríos' },
  { email: 'mpmraquel7@gmail.com', first_name: 'Mirta Raquel', last_name: 'Pérez López' },
  { email: 'malp2008@gmail.com', first_name: 'Miguel Ángel', last_name: 'Lázaro Puebla' },
  { email: 'monica.castells.fernandez@gmail.com', first_name: 'Mónica', last_name: 'Castells Fernández' },
  { email: 'murriaz@gmail.com', first_name: 'Miguel Ángel', last_name: 'Murria Zorrilla' },
  { email: 'miriamnicolasolivera@hotmail.com', first_name: 'Miriam', last_name: 'Nicolás Olivera' },
  { email: 'alexnuriacanovas@gmail.com', first_name: 'Montse', last_name: 'Bustos García' },
  { email: 'monica.ageacac@gmail.com', first_name: 'Mónica', last_name: 'Barboza García' },
  { email: 'm_lgracia@msn.com', first_name: 'Montse', last_name: 'López De Gracia' },
  { email: 'cim.monica15@gmail.com', first_name: 'Monica', last_name: 'Nuñez Avila' },
  { email: 'herrera.myrna@gmail.com', first_name: 'Myrna', last_name: 'Herrera' },
  { email: 'mirenurka@gmail.com', first_name: 'Miren', last_name: 'Meabo Carro' },
  { email: 'montse.garciav@gmail.com', first_name: 'Montse', last_name: 'García Viñó' },
  { email: 'nereaceae85@gmail.com', first_name: 'Nerea', last_name: 'Dafonte Bastida' },
  { email: 'liliguapacha@hotmail.com', first_name: 'Nancy Liliana', last_name: 'Guapacha Largo' },
  { email: 'nincm83@hotmail.com', first_name: 'Nines', last_name: 'Corregidor Martínez' },
  { email: 'nachalopezcuevas@gmail.com', first_name: 'Nacha', last_name: 'López Cuevas' },
  { email: 'jegamu66@hotmail.com', first_name: 'Montse', last_name: 'Muñoz Casado' },
  { email: 'nicolaspsanmartin@gmail.com', first_name: 'Nicolás', last_name: 'San Martín' },
  { email: 'nnkm65@hotmail.com', first_name: 'Natalia', last_name: 'Kramarov' },
  { email: 'orlando.gallegos.019@gmail.com', first_name: 'Orlando', last_name: 'Gallegos Enriquez' },
  { email: 'nere_gali@hotmail.com', first_name: 'Nerea', last_name: 'Bustillo Seoane' },
  { email: 'nuriagbartolome@gmail.com', first_name: 'Nuria María', last_name: 'García Bartolome' },
  { email: 'nufoda33@gmail.com', first_name: 'Nuria', last_name: 'Fores Daura' },
  { email: 'tndrcursos.orlandogallegos@gmail.com', first_name: 'Orlando', last_name: 'Gallegos' },
  { email: 'paupperez@gmail.com', first_name: 'Paula Andrea', last_name: 'Pérez Pérez' },
  { email: 'sanchezalgaba@gmail.com', first_name: 'Paloma', last_name: 'Sánchez-Algaba' },
  { email: 'patricia.echevarria.ruiz@gmail.com', first_name: 'Patricia', last_name: 'Echevarría Ruiz' },
  { email: 'patximartin75@gmail.com', first_name: 'Patxi', last_name: 'Martín Valencia' },
  { email: 'paulaest2@hotmail.com', first_name: 'Paula', last_name: 'Estelrich Estades' },
  { email: 'tndrcursos.pazgarcia@gmail.com', first_name: 'Paz', last_name: 'García' },
  { email: 'hermitagecentre@gmail.com', first_name: 'Paul', last_name: 'Butler' },
  { email: 'm.pazgarciasola@gmail.com', first_name: 'Paz', last_name: 'García Sola' },
  { email: 'ppozzato7@gmail.com', first_name: 'Paolo', last_name: 'Pozzato' },
  { email: 'psantistebandiez@gmail.com', first_name: 'Pedro', last_name: 'Santisteban Díez' },
  { email: 'pedrojperello@gmail.com', first_name: 'Pedro José', last_name: 'Perelló Pascual' },
  { email: 'w_moctezuma@hotmail.com', first_name: 'Paola', last_name: 'Moctezuma' },
  { email: 'pedrobayod@gmail.com', first_name: 'Pedro Ángel', last_name: 'Bayod Embún' },
  { email: 'pabloguerrago@yahoo.es', first_name: 'Pablo', last_name: 'Guerra González' },
  { email: 'priscilaochoaleon@gmail.com', first_name: 'Priscila', last_name: 'Ochoa Leon' },
  { email: 'rafaevolutivo@gmail.com', first_name: 'Rafael', last_name: 'Colino Lucio' },
  { email: 'prathnakaur@hotmail.com', first_name: 'Prathnakaur', last_name: 'Sánchez Fernández' },
  { email: 'poly20san@hotmail.com', first_name: 'Poliana', last_name: 'Alves Dos Santos' },
  { email: 'ralpilopez@gmail.com', first_name: 'Pilar', last_name: 'López Jiménez' },
  { email: 'snnssy-77@hotmail.co.jp', first_name: 'Sayaka', last_name: 'Nozki' },
  { email: '26500.ro@gmail.com', first_name: 'Rocio', last_name: 'Gonzalez Diaz' },
  { email: 'infostdc@gmail.com', first_name: 'Rufino', last_name: 'Blanco Torrado' },
  { email: 'rolandosanmar@yahoo.es', first_name: 'Rolando', last_name: 'San Martín Pérez' },
  { email: 'rebecagreciano@gmail.com', first_name: 'Rebeca', last_name: 'Greciano Tejedor' },
  { email: 'sandraricart@hotmail.es', first_name: 'Sandra', last_name: 'Ricart Orgilles' },
  { email: 'rcmarcuartu@gmail.com', first_name: 'Regina', last_name: 'Candel Marcuartu' },
  { email: 'rutrevueltaleon@gmail.com', first_name: 'Rut', last_name: 'Revuelta León' },
  { email: 'erqueiq81@hotmail.com', first_name: 'Rubén', last_name: 'Estacio Matamoros' },
  { email: 'rbnmoral@gmail.com', first_name: 'Rubén', last_name: 'Moral Barbero' },
  { email: 'adinar2000@yahoo.es', first_name: 'Rosa', last_name: 'Sánchez Vázquez' },
  { email: 'enyahrosa@gmail.com', first_name: 'Rosa', last_name: 'Hitos' },
  { email: 'raimonda19661210@hotmail.com', first_name: 'Raimonda', last_name: 'Beconiene' },
  { email: 'soniacarcer@hotmail.com', first_name: 'Sonia', last_name: 'Martínez Moreno' },
  { email: 'snadal.90@hotmail.es', first_name: 'Silvia', last_name: 'Nadal Navarro' },
  { email: 'agatainti1958@gmail.com', first_name: 'Silvia Adriana', last_name: 'Rodríguez Martínez' },
  { email: 'saraliebana@yahoo.es', first_name: 'Sara', last_name: 'Liébana Macho' },
  { email: 'shegasa@gmail.com', first_name: 'Sheila', last_name: 'García Sanchez' },
  { email: 'adry_villa@hotmail.com', first_name: 'Sergio Adrián', last_name: 'Borge Pajares' },
  { email: 'tndrcursos.silviabaars@gmail.com', first_name: 'Silvia', last_name: 'Baars' },
  { email: 'silviapesado@hotmail.com', first_name: 'Silvia', last_name: 'Pesado Pazos' },
  { email: 'simonasbeconis@gmail.com', first_name: 'Simonas', last_name: 'Beconis' },
  { email: 'sara.salinas@gmail.com', first_name: 'Sara', last_name: 'Salinas Simón' },
  { email: 'seequilibrium@gmail.com', first_name: 'Silvia Elena', last_name: 'Sanchez Quijano' },
  { email: 'shirley.univio@gmail.com', first_name: 'Shirlay Liliana', last_name: 'López Univio' },
  { email: 'sergiogondel80@gmail.com', first_name: 'Sergio', last_name: 'Sáenz González' },
  { email: 'xexi_469@hotmail.com', first_name: 'Sergio', last_name: 'Campos Junyent' },
  { email: 'sergimunozmunoz@gmail.com', first_name: 'Sergio', last_name: 'Muñoz Muñoz' },
  { email: 'solekny@hotmail.com', first_name: 'Sole', last_name: 'Toledano Poveda' },
  { email: 'silviamvindel@gmail.com', first_name: 'Silvia', last_name: 'Moran Vindel' },
  { email: 'rodrigo.marsan05@gmail.com', first_name: 'Rodrigo', last_name: 'Martínez Sánchez' },
  { email: 'susana.ferre83@gmail.com', first_name: 'Susana', last_name: 'Ferre Margalef' },
  { email: 'claupauda75@yahoo.es', first_name: 'Susana', last_name: 'Aragón Salietti' },
  { email: 'patricastaneda.correos@yahoo.es', first_name: 'Susana Patricia', last_name: 'Castaneda Pascua' },
  { email: 'soniarubia22@hotmail.com', first_name: 'Sonia', last_name: 'Rubia Cardona' },
  { email: 'elgaia@tinet.cat', first_name: 'Susana', last_name: 'Limeres Paez' },
  { email: 'ssj35@hotmail.es', first_name: 'Soralla', last_name: 'San José Arellano' },
  { email: 'susansilvero36@gmail.com', first_name: 'Susan', last_name: 'Silvero' },
  { email: 's.toyas@hotmail.com', first_name: 'Sonia', last_name: 'Toyas Berdonces' },
  { email: 'mejiassol@gmail.com', first_name: 'Soledad', last_name: 'Mejías Candelas' },
  { email: 'verodehoyos@gmail.com', first_name: 'Verónica', last_name: 'de Hoyos Ojesto' },
  { email: 'anagalsol@gmail.com', first_name: 'Ana Maria', last_name: 'Galilea Solano' },
  { email: 'beamaestro@protonmail.com', first_name: 'Bea', last_name: 'Maestro Castillo' },
  { email: 'desi.millan@gmail.com', first_name: 'Desiree', last_name: 'Millán Hernández' },
  { email: 'klga.alejandro@gmail.com', first_name: 'Alejandro', last_name: 'García Castejada' },
  { email: 'enfirme@gmail.com', first_name: 'Antonio Carlos', last_name: 'Sorroche Galilea' },
  { email: 'txalsmm@gmail.com', first_name: 'Carlos', last_name: 'Maiztegui Muñiz' },
  { email: 'tndrcursos.davidmolina@gmail.com', first_name: 'David', last_name: 'Molina' },
  { email: 'eddy_264@hotmail.com', first_name: 'Cecilio Eduardo', last_name: 'Camino Pinto' },
  { email: 'cristina_mon@hotmail.com', first_name: 'Cristina', last_name: 'Montero Revoltos' },
  { email: 'edurne_14@hotmail.es', first_name: 'Edurne', last_name: 'Sanz García' },
  { email: 'cristinaaurea@icloud.com', first_name: 'Cristina', last_name: 'Martinez Sampietro' },
  { email: 'antonia-milagros@hotmail.com', first_name: 'Antonia', last_name: 'Fernández Espin' },
  { email: 'ebllano@hotmail.com', first_name: 'Estébaliz', last_name: 'Llano Fernández' },
  { email: 'greysyvascomontoya@gmail.com', first_name: 'Greysy Yliana', last_name: 'Vasco Montoya' },
  { email: 'taniuskaboris@gmail.com', first_name: 'Tatiana', last_name: 'Borisenko Uvarenko' },
  { email: 'tndrcursos.tamarasanmartin@gmail.com', first_name: 'Tamara', last_name: 'San Martín' },
  { email: 'callebejar666@hotmail.com', first_name: 'Teresa', last_name: 'Pérez Fernández' },
  { email: 'tomas.antolin@hotmail.com', first_name: 'Tomás', last_name: 'Antolín Osante' },
  { email: 'tania.pereira.mendez@gmail.com', first_name: 'Tania', last_name: 'Pereira Mendes' },
  { email: 'mssvero7@gmail.com', first_name: 'Verónica', last_name: 'Solaz' },
  { email: 'vicen-buigues@hotmail.com', first_name: 'Vicen', last_name: 'Buigues Cabrera' },
  { email: 'tiagoabascal.v@gmail.com', first_name: 'Tiago', last_name: 'Abascal Valdez' },
  { email: 'fernandezdelahozvidal@gmail.com', first_name: 'Vidal', last_name: 'Fernández de la Hoz' },
  { email: 'vanesarnau@gmail.com', first_name: 'Vanesa', last_name: 'Arnau Domenech' },
  { email: 'jingvet@gmail.com', first_name: 'Vanessa', last_name: 'Bentanachs Martin' },
  { email: 'yoyo3065@gmail.com', first_name: 'Yolanda', last_name: 'Méndez Sáenz' },
  { email: 'xavierbarcelo@hotmail.com', first_name: 'Xavier', last_name: 'Barceló Cadiere' },
  { email: 'xavigrana2@hotmail.com', first_name: 'Xavi', last_name: 'Granados Contreras' },
  { email: 'aquiyahoraesperfecto@gmail.com', first_name: 'Maria Elena', last_name: 'Martinez' },
  { email: 'begrazu@gmail.com', first_name: 'Begoña', last_name: 'Irazu Alonso' },
  { email: 'yolandagd77@hotmail.com', first_name: 'Yolanda', last_name: 'Gutiérrez Duarte' },
  { email: 'ximena.alvarez@web.de', first_name: 'Ximena', last_name: 'Álvarez' },
  { email: 'valentina.stuardoaes@gmail.com', first_name: 'Valentina Sofía', last_name: 'Stuardo Aeschimann' },
  { email: 'v.lopez.talavera@gmail.com', first_name: 'Virginia', last_name: 'López Talavera' },
  { email: 'glorialopezgarciademarina@hotmail.com', first_name: 'Gloria', last_name: 'Lopez Garcia de Marina' },
  { email: 'ismoga78@gmail.com', first_name: 'Isabel', last_name: 'Moreno García' },
  { email: 'joluel56@hotmail.com', first_name: 'José Luis', last_name: 'Rubio Regueiro' },
  { email: 'glessan83@gmail.com', first_name: 'Gloria', last_name: 'Escudero Sánchez' },
  { email: 'mdd.delgado.galdos@gmail.com', first_name: 'María de Dorleta', last_name: 'Delgado Galdos' },
  { email: 'mamavivi.coria@gmail.com', first_name: 'Maria Victoria', last_name: 'Martín Rodríguez' },
  { email: 'mikibilbao@gmail.com', first_name: 'Miguel Ángel', last_name: 'Herrero Casado' },
  { email: 'pablo.larras@gmail.com', first_name: 'Pablo', last_name: 'Aragón Larrasquitu' },
  { email: 'amarillo44@gmail.com', first_name: 'Victor', last_name: 'Piquer' },
  { email: 'marilenablumer1944@gmail.com', first_name: 'Eric', last_name: 'Piir Blumer' },
  { email: 'tndrcursos.finareygarcia@gmail.com', first_name: 'Fina', last_name: 'Rey García' },
  { email: 'izaskuntndr@gmail.com', first_name: 'Izaskun', last_name: 'Ezkurra Zabala' },
  { email: 'jmiguelsuarez@gmail.com', first_name: 'José Miguel', last_name: 'Suárez Martínez' },
  { email: 'garcicasjuajgc12@gmail.com', first_name: 'Juani', last_name: 'García Cascales' },
  { email: 'pvelasc@gmail.com', first_name: 'Francisca', last_name: 'Velasco Alcantara' },
  { email: 'jfukuan@gmail.com', first_name: 'Juan Luis', last_name: 'Villazala Del Toro' },
  { email: 'mjgomezlazaro@gmail.com', first_name: 'María Jesús', last_name: 'Gómez Lázaro' },
  { email: 'miremassu@gmail.com', first_name: 'Mireia', last_name: 'Masuet Barceló' },
  { email: 'iridologos@hotmail.com', first_name: 'Salvatore', last_name: 'Russo' },
  { email: 'vanelaza80@gmail.com', first_name: 'Vanesa', last_name: 'Lázaro Valdivieso' },
  { email: 'jjaamontes@gmail.com', first_name: 'José Antonio', last_name: 'Montes de Oca Rueda' },
  { email: 'g.josefina700@gmail.com', first_name: 'Josefina', last_name: 'Gutierrez Borrego' },
  { email: 'gabrielunivio@gmail.com', first_name: 'Gabriel', last_name: 'Univio Sierra' },
  { email: 'masespronceda@gmail.com', first_name: 'Maite', last_name: 'Salinas Esquiroz' },
  { email: 'eliobeli@hotmail.com', first_name: 'María Belén', last_name: 'Ruiz Amores' },
  { email: 'miguelyanalarragueta@hotmail.com', first_name: 'Iguel', last_name: 'San Vicente Recalde' },
  { email: 'miguelangelm73@gmail.com', first_name: 'Miguel Ángel', last_name: 'Martínez Martín' },
  { email: 'oliviaaguilarterapias@gmail.com', first_name: 'Olivia', last_name: 'Aguilar Ayala' },
  { email: '670799376a@gmail.com', first_name: 'Ramón', last_name: 'García Silva' },
  { email: 'sarayrevuelta@gmail.com', first_name: 'Saray', last_name: 'Revuelta León' },
  { email: 'sofibiel8@gmail.com', first_name: 'Sofía', last_name: 'Ramos Cobos' },
  { email: 'victoriavelezr@hotmail.com', first_name: 'Victoria Eugenia', last_name: 'Velez Rodríguez' },
  { email: 'tonibc-9@hotmail.com', first_name: 'Antonio', last_name: 'Bernabeu Crespo' },
  { email: 'maicamicra@gmail.com', first_name: 'Maica', last_name: 'Corbí' },
  { email: 'susilandia1@gmail.com', first_name: 'Marta', last_name: 'Flores Tomás' },
  { email: 'tndrcursos.monicabarboza@gmail.com', first_name: 'Mónica Penelope', last_name: 'Barboza Garcia' },
  { email: 'topitobellvi@hotmail.com', first_name: 'Montserrat', last_name: 'Vela Fayos' },
  { email: 'medicinayosteopatia@gmail.com', first_name: 'Osvaldo', last_name: 'Molina' },
  { email: 'renacersconsciente@gmail.com', first_name: 'David', last_name: 'Molina Cano' },
  { email: 'julenaldaiquintero88@gmail.com', first_name: 'Julen', last_name: 'Aldai Quintero' },
  { email: 'maria@fengshui.es', first_name: 'María', last_name: 'Uriel Narvion' },
  { email: 'mirian.mesuro@gmail.com', first_name: 'Mirian', last_name: 'Mesuro Merino' },
  { email: 'monitime@hotmail.com', first_name: 'Monica', last_name: 'Hernández Roseti' },
  { email: 'sandra.eusk@gmail.com', first_name: 'Sandra', last_name: 'Martín Grandos' },
  { email: 'saioame@hotmail.com', first_name: 'Saioa', last_name: 'Martínez Estevez' },
  { email: 'afernandezg@outlook.es', first_name: 'Ramón', last_name: 'Fernández Doblado' },
  { email: 'lolatndr@gmail.com', first_name: 'Lola', last_name: 'López Rojo' },
  { email: 'txusilla7@hotmail.com', first_name: 'Maria Jesus', last_name: 'Melero Sanchez' },
  { email: 'moma1971@gmail.com', first_name: 'Monica', last_name: 'Martínez Sampietro' },
  { email: 'rapaquelpe1@hotmail.com', first_name: 'Raquel', last_name: 'Sánchez Sainz-Maza' },
  { email: 'sgunning@netlanguages.com', first_name: 'Sharon', last_name: 'Gunning' },
  { email: 'thib.delbrouck@gmail.com', first_name: 'Thibault', last_name: 'Delbrouck' },
  { email: 'yajaira.almeida@live.com', first_name: 'Yajaira', last_name: 'Almeida Gutierrez' },
  { email: 'utisantamaria@gmail.com', first_name: 'María Nilda', last_name: 'Zenique' },
  { email: 'luisma3f@gmail.com', first_name: 'Luis María', last_name: 'López Díaz' },
  { email: 'mirabilys@hotmail.com', first_name: 'María', last_name: 'Ramírez Fabelo' },
  { email: 'noemi@aciertaformacion.es', first_name: 'Noemí', last_name: 'Jiménez Sahagún' },
  { email: 'zulmasecuelo@gmail.com', first_name: 'Zulma Noemi', last_name: 'Secuelo' },
  { email: 'mjsetien83@gmail.com', first_name: 'María José', last_name: 'Setien Hurtado' },
  { email: 'priosol1@hotmail.com', first_name: 'Pablo', last_name: 'Del Río Solla' },
  { email: 'univio_22@hotmail.com', first_name: 'Rubén', last_name: 'Univio' },
  { email: 'ainosbcn@hotmail.com', first_name: 'Sonia', last_name: 'Morera' },
  // Goretti añadida al grupo
  { email: 'gorettisubinas@gmail.com', first_name: 'Goretti', last_name: 'Subinas Arambarri' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const authHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

/** Devuelve todos los usuarios de Supabase Auth (paginado). */
async function fetchAllUsers() {
  const all = [];
  let page = 1;
  while (true) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=${page}&per_page=1000`, { headers: authHeaders });
    if (!res.ok) throw new Error(`Error listando usuarios: ${res.status} ${await res.text()}`);
    const { users } = await res.json();
    all.push(...users);
    if (users.length < 1000) break;
    page++;
  }
  return all;
}

/** Actualiza nombre en user_metadata. */
async function updateName(userId, first_name, last_name) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      user_metadata: {
        first_name,
        last_name,
        full_name: `${first_name} ${last_name}`,
        name: `${first_name} ${last_name}`,
      },
    }),
  });
  if (!res.ok) throw new Error(`Error actualizando nombre ${userId}: ${res.status} ${await res.text()}`);
}

/** Upsert del rol en customer_role_assignments. */
async function upsertRole(userId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/customer_role_assignments`, {
    method: 'POST',
    headers: { ...authHeaders, Prefer: 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify({ user_id: userId, role_id: ROLE_ID }),
  });
  if (!res.ok && res.status !== 409) throw new Error(`Error rol ${userId}: ${res.status} ${await res.text()}`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (!SUPABASE_KEY) { console.error('❌ Falta SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }

  console.log(`\n${'─'.repeat(60)}`);
  console.log('  Actualización nombre + rol – Alumnos TNDR');
  if (DRY_RUN) console.log('  ⚠️  MODO DRY-RUN');
  console.log(`  ${ALUMNOS.length} alumnos a actualizar`);
  console.log(`${'─'.repeat(60)}\n`);

  console.log('📋 Cargando usuarios de Supabase...');
  const allUsers = await fetchAllUsers();
  console.log(`   ${allUsers.length} usuarios encontrados\n`);

  const byEmail = new Map(allUsers.map(u => [u.email?.toLowerCase(), u]));
  const results = { ok: [], notFound: [], errors: [] };

  for (let i = 0; i < ALUMNOS.length; i++) {
    const { email, first_name, last_name } = ALUMNOS[i];
    const tag = `[${String(i + 1).padStart(3, '0')}/${ALUMNOS.length}] ${email}`;
    const user = byEmail.get(email.toLowerCase());

    if (!user) {
      console.log(`  ⚠️  ${tag} → NO encontrado`);
      results.notFound.push(email);
      continue;
    }

    try {
      if (!DRY_RUN) {
        await updateName(user.id, first_name, last_name);
        await upsertRole(user.id);
      }
      console.log(`  ✅ ${tag} → ${first_name} ${last_name}${DRY_RUN ? ' (simulado)' : ''}`);
      results.ok.push(email);
    } catch (err) {
      console.error(`  ❌ ${tag} → ${err.message}`);
      results.errors.push({ email, reason: err.message });
    }

    if (i < ALUMNOS.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log('  RESUMEN');
  console.log(`${'─'.repeat(60)}`);
  console.log(`  ✅ Actualizados : ${results.ok.length}`);
  console.log(`  ⚠️  No encontrados: ${results.notFound.length}`);
  console.log(`  ❌ Errores      : ${results.errors.length}`);
  if (results.notFound.length) { console.log('\n  No encontrados:'); results.notFound.forEach(e => console.log(`    · ${e}`)); }
  if (results.errors.length)   { console.log('\n  Errores:'); results.errors.forEach(({ email, reason }) => console.log(`    · ${email} → ${reason}`)); }
  console.log(`\n${'─'.repeat(60)}\n`);

  if (results.errors.length) process.exit(1);
}

main().catch(err => { console.error('Error fatal:', err); process.exit(1); });
