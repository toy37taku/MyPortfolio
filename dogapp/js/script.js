import breedTranslations from './breedTranslations.js';
import breedCharacteristics from './breedCharacteristics.js';

// ページロード時に犬種リストをセレクトボックスに追加
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://dog.ceo/api/breeds/list/all')
        .then(response => response.json())
        .then(data => {
            const breedSelect = document.getElementById('breedSelect');
            Object.keys(data.message).forEach(breed => {
                const option = document.createElement('option');
                option.value = breed;
                option.textContent = breedTranslations[breed] || breed;
                breedSelect.appendChild(option);
            });
        })
        .catch(console.error);
});

// 犬種のランダムな画像を取得して表示
function getRandomDogImage() {
    const breedSelect = document.getElementById('breedSelect');
    const breed = breedSelect.value;
    const output = document.getElementById('output');
    const characteristics = document.getElementById('characteristics');

    if (breed == '') {
        alert("犬種を選択してください");
        return;
    }

    output.style.opacity = 0; // フェードアウト

    fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
        .then(response => response.json())
        .then(json => {
            output.src = json.message;
            output.onload = () => output.style.opacity = 1; // フェードイン
            characteristics.textContent = breedCharacteristics[breed] || "この犬種の特徴は不明です";
        })
        .catch(() => {
            output.src = '';
            output.style.opacity = 0; // 画像非表示
            characteristics.textContent = "画像取得に失敗しました";
        });
}

// ボタンクリックイベントを設定
document.getElementById('fetchButton').addEventListener('click', getRandomDogImage);

// リセットボタンのクリックイベントを設定
document.getElementById('resetButton').addEventListener('click', () => {
    const output = document.getElementById('output');
    const characteristics = document.getElementById('characteristics');

    output.style.opacity = 0; // フェードアウト
    setTimeout(() => {
        output.src = '../dogapp/img/dogHouse.png'; // 犬小屋の画像に戻す
        output.style.opacity = 1; // フェードイン
    }, 500);

    document.getElementById('breedSelect').selectedIndex = 0;
    characteristics.textContent = "ここに犬の特徴を表示します"; // 特徴リセット
});
