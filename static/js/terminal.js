const terminal = document.getElementById('terminal');
const commandInput = document.getElementById('command');

commandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = commandInput.value;
        terminal.innerHTML += `<span>$ ${command}</span><br>`;
        fetch('/run_command', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `command=${encodeURIComponent(command)}`
        })
            .then(response => response.json())
            .then(data => {
                terminal.innerHTML += `<span>${data.output}</span><br>`;
                terminal.scrollTop = terminal.scrollHeight;
            })
            .catch(error => {
                terminal.innerHTML += `<span>Error: ${error}</span><br>`;
                terminal.scrollTop = terminal.scrollHeight;
            });
        commandInput.value = '';
    }
});
