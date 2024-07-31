const returnButton = document.getElementById('returnButton');
returnButton.addEventListener('click', () => {
    console.log('トップに戻るがクリックされました')
    window.location.href = './index.html';
});