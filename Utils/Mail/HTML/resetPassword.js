const resetPasswordHtml = (name, link) => {
    return `<!DOCTYPE html>
        <html>
            <body>
                <p>Hi ${name}, As per your request, we have sent you a link to rest your password. </p>
                <br/>
                <p>Click on the link below or copy paste in your browser.</p>
                <br/>
                <a href=${link} target="_blank"">${link}</a>
                </body>
        </html>`;
};
export default resetPasswordHtml;
