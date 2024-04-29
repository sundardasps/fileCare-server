import nodemailar from "nodemailer";

const sendMail = async (email,subject,otp) => {
  try {
  console.log(email,subject,otp,"-----------------------r");
    
    const transporter = nodemailar.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.AUTHEMAIL,
        pass: process.env.AUTHPASSWORD,
      },
    });

    transporter.verify((err, success) => {
      err
        ? console.log(err)
        : console.log(`=== Server is ready to take messages: ${success} ===`);
    });

    const mailOptions = {
      from: process.env.AUTHEMAIL,
      to: email,
      subject: subject,
      html:`
      <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
        <h2 style="color: #007bff;">Your OTP</h2>
        <p style="font-size: 16px;">Here is your OTP: <strong style="color: #007bff;" >${otp}</strong></p>
        <p style="font-size: 12px; color: #777;">Please do not share this OTP with anyone.</p>
      </div>
    `,
    };

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export default sendMail;
