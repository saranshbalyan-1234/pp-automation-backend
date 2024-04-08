const registerHTML = (name, link) => {
    return `<!DOCTYPE html>
        <html>
            <body>
                <p>Hi ${name}, We're excited to have you get started. First, you need to confirm your account.</p>
                <br/>
                <p>Click on the link below or copy paste in your browser.</p>
                <br/>
                <a href=${link} target="_blank"">${link}</a>
                </body>
        </html>`;
};
export default registerHTML;
