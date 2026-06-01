import { Code } from "../models/Code.model.js";
import emailjs from "@emailjs/nodejs";
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
});

const template = (email, code) => `
<div style="background:#f4f9ff; padding:20px; font-family: Arial, sans-serif;">
  
  <div style="max-width:500px; margin:auto; border-radius:20px; overflow:hidden;">
    
    <!-- Image -->
    <div class="w-full flex items-center justify-center"><svg width="100" height="100" viewBox="0 0 100 100"
          fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 25C36.19 25 25 36.19 25 50C25 54.2 26.05 58.15 27.85 61.6L25 72L35.4 69.15C38.85 70.95 42.8 72 47 72C60.81 72 72 60.81 72 47"
            stroke="#F59E0B" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />

          <circle cx="50" cy="48" r="13" stroke="#F59E0B" stroke-width="6" />

          <path d="M68 33L66.5 29.5L63 28L66.5 26.5L68 23L69.5 26.5L73 28L69.5 29.5L68 33Z" fill="#F59E0B" />

          <line x1="62" y1="21" x2="63.5" y2="19" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" />
          <line x1="68" y1="18" x2="68" y2="15" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" />
          <line x1="74" y1="21" x2="72.5" y2="19" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" />
        </svg></div>

    <!-- Content -->
    <div style="padding:30px 20px; text-align:center;">
      
      <h2 style="margin:0; color:#F59E0B;">CitApp</h2>

      <p style="margin:20px 0; color:#1D3C6B;">
       ${email}
      </p>

      <h1 style="color:#1D3C6B; letter-spacing:5px;">
        ${code}
      </h1>

      <p style="color:#1D3C6B;">
        Ce code expire dans <b>10 minutes</b>.
      </p>

      <!-- Button -->
      <a href="${process.env.FRONTEND_URL}/settings"
         style="
           display:inline-block;
           margin-top:25px;
           padding:12px 20px;
           background:green;
           color:white;
           text-decoration:none;
           border-radius:10px;
           font-weight:bold;
         ">
         Confirmer
      </a>

    </div>

  </div>

  <!-- Footer -->
  <p style="text-align:center; font-size:12px; color:#6a7f9e; margin-top:20px;">
    CitApp : les pensées sont toujours valorisées. Par li't-dev.
  </p>

</div>
`;

// export async function createCode({ email, code }) {

//   const transporter = nodemailer.createTransport({
//     host: "sandbox.smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//       user: process.env.MAILTRAP_USER,
//       pass: process.env.MAILTRAP_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: "test@test.com",
//     to: email,
//     subject: "Modification citApp",
//     html: template(email, code)
//   });

//   await Code.create({
//     email,
//     code,
//     expiresAt: new Date(Date.now() + 10 * 60 * 1000),
//   });
// }

export async function createCode({ email, code }) {
  try {
    const templateParams = {
      to_email: email, 
      verification_code: code,
      user_email: email, 
    };

    // Envoi via EmailJS
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY, // recommandé sur le backend
      },
    );


    // Création du code dans la base de données
    await Code.create({
      email,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
  } catch (error) {
    throw new Error("Impossible d'envoyer le code de vérification");
  }
}

export async function verifyCode({ email, code }) {
  return Code.findOne({
    email,
    code,
    expiresAt: { $gt: new Date() },
  });
}
