var socket = io('http://localhost:5000'),
    list = document.getElementById('cats-list'),
    pagination = document.querySelector('.pagination');

function renderPage (cats) {
    list.innerHTML = '';

    cats.forEach(function (cat) {
        var catElement = document.createElement('div');

        catElement.setAttribute('class', 'panel panel-default');
        catElement.innerHTML =  '<div class="panel-heading">' +
            '<h3 class="panel-title"><img src="' + cat.image + '" /> &nbsp; ' + cat.name + '</h3>' +
        '</div>' +
        '<div class="panel-body">' +
            '<p><strong>Age:</strong> ' + cat.age + '</p>' +
            '<p><strong>Email:</strong> ' + cat.email + '</p>' +
            '<p><strong>Twitter:</strong> ' + cat.twitter + '</p>' +
            '<p><strong>Website:</strong> ' + cat.website + '</p>' +
        '</div>';

        list.appendChild(catElement);
    });
}

function goToPage (page) {
    socket.emit('get-page', {
        page: page,
        per: 25
    });
}

function pageClick (e) {
    e.preventDefault();
    goToPage(parseInt(e.target.innerHTML, 10));
}

function renderPageNumber (i, active) {
    var li = document.createElement('li'),
        a = document.createElement('a');

    if (active) {
        li.setAttribute('class', 'active');
    }

    a.innerHTML = i;
    a.setAttribute('href', '#');
    a.addEventListener('click', pageClick);

    li.appendChild(a);
    pagination.appendChild(li);
}

function renderPagination (pages) {
    pagination.innerHTML = '', pageElements = [];
    for (var i = 1; i < pages.last; i++) {
        renderPageNumber(i, i === pages.page);
    }
}

socket.on('render-page', function (data) {
    renderPage(data.cats);
    renderPagination(data.pages);
});

document.addEventListener('deviceready', function () {
    goToPage(1);
});
