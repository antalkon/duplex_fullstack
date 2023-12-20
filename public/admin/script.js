function submitForm() {
    const user = document.getElementById('user').value;
    const password = document.getElementById('password').value;

    fetch('/admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login: user, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Успешная авторизация') {
                const { id, lgoin, name } = data.user;

                const expiration = 60 * 60 * 24 * 3; // Время жизни куки - 3 дня

                document.cookie = `id=${id}; max-age=${expiration}`;
                document.cookie = `login=${lgoin}; max-age=${expiration}`;
                document.cookie = `name=${name}; max-age=${expiration}`;
                document.cookie = `authorization=true; max-age=${expiration}`;

                // Показываем сообщение о успешной авторизации
                document.getElementById('authResponse').style.left = '2%'
                document.getElementById('authResponse').style.display = 'block';
                //document.getElementById('authResponse').innerText = JSON.stringify(data);

                // Отложенная переадресация на другую страницу через 5 секунд
                setTimeout(() => {
                    window.location.href = 'http://duplex.zentas.ru/admin/dashboard';
                }, 5000);
            } else {
                console.log('Ошибка авторизации:', data.error);
            }
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
        });
}
