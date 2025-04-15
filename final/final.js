document.getElementById('dartboard').addEventListener('click', (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    console.log(`Dart hit at coordinates: (${x}, ${y})`);
});
