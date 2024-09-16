const mailOptions = {
  from: process.env.MAIL_FROM_ADDRESS,
  to: email,
  subject: "FORGOT PASSWORD",
  template: "forgot-password",
  context: {
    userName: user.userName,
    resetCode: resetCode,
  },
};

export default mailOptions;
