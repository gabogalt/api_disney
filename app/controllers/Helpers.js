const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const Helpers = {
	sendEmail: async (to, subject, html) => {
		const msg = {
			to,
			from: process.env.FROM,
			subject,
			html,
		};

		try {
			await sgMail.send(msg);
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	},
};

module.exports = Helpers;
