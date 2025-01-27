document.getElementById('imageForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData();
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];
    formData.append('image', file);

    try {
        const uploadedImage = document.getElementById('uploadedImage');
        uploadedImage.src = URL.createObjectURL(file);
        document.getElementById('output').style.display = 'block';

        const response = await fetch('http://127.0.0.1:5000/analyze', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        displayResults(result);

    } catch (error) {
        console.error(error);
        alert('An error occurred while analyzing the image.');
    }
});
function displayResults(result) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (result.caption) {
        const captionCard = document.createElement('div');
        captionCard.classList.add('result-card', 'caption');
        captionCard.innerHTML = `
            <h5>Caption</h5>
            <p><strong>Text:</strong> ${result.caption.text}</p>
            <p><strong>Confidence:</strong> ${(result.caption.confidence * 100).toFixed(2)}%</p>
        `;
        resultsDiv.appendChild(captionCard);
    }

    if (result.tags) {
        const tagsCard = document.createElement('div');
        tagsCard.classList.add('result-card', 'tags');
        tagsCard.innerHTML = `
            <h5>Tags</h5>
            <p><strong>Tags:</strong> ${result.tags.map(tag => `${tag.name} (${(tag.confidence * 100).toFixed(2)}%)`).join(', ')}</p>
        `;
        resultsDiv.appendChild(tagsCard);
    }

    if (result.objects) {
        const objectsCard = document.createElement('div');
        objectsCard.classList.add('result-card', 'objects');
        objectsCard.innerHTML = `
            <h5>Objects</h5>
            <p><strong>Objects:</strong> ${result.objects.map(obj => `${obj.tags[0].name} (${(obj.tags[0].confidence * 100).toFixed(2)}%)`).join(', ')}</p>
        `;
        resultsDiv.appendChild(objectsCard);
    }

    // Make the output visible after results are displayed
    document.getElementById('output').style.display = 'block';
}
