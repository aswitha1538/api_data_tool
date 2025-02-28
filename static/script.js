document.getElementById('fetch-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const resultDiv = document.getElementById('repos-result');

    try {
        const response = await fetch('/fetch_repos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
        } else {
            resultDiv.innerHTML = `<p>Fetched ${data.count} repositories:</p><ul>` + 
                data.repos.map(repo => `<li>${repo.name} (Stars: ${repo.stars})</li>`).join('') + 
                '</ul>';
        }
    } catch (error) {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
});

document.getElementById('add-field').addEventListener('click', () => {
    const fieldsDiv = document.getElementById('fields');
    const newField = document.createElement('div');
    newField.className = 'field-group';
    newField.innerHTML = `
        <input type="text" name="key" placeholder="Key" required>
        <input type="text" name="value" placeholder="Value" required>
    `;
    fieldsDiv.appendChild(newField);
});

document.getElementById('post-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fields = document.querySelectorAll('.field-group');
    const data = {};
    fields.forEach(field => {
        const key = field.querySelector('input[name="key"]').value;
        const value = field.querySelector('input[name="value"]').value;
        if (key && value) data[key] = value;
    });

    const resultDiv = document.getElementById('post-result');
    try {
        const response = await fetch('/post_data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (result.error) {
            resultDiv.innerHTML = `<p style="color: red;">Error: ${result.error}</p>`;
        } else {
            resultDiv.innerHTML = `
                <p style="color: green;">Success!</p>
                <p>Sent Data: ${JSON.stringify(result.sent_data)}</p>
                <p>Server Response: ${JSON.stringify(result.response)}</p>
            `;
        }
    } catch (error) {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
});