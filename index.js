const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const USERS_PER_PAGE = 28

const users = [];
let filteredUsers = []

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector('#search-input')
const profileModal = document.querySelector('#profile-modal')
const paginator = document.querySelector('#paginator')

function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
          <div class="d-flex justify-content-center flex-wrap">
        <div class="mb-2">
          <div class="card mr-2">
            <img class="user-image" src="${item.avatar}" alt="User Avatar">
            <div class="card-body text-center">
              <p class="card-title">${item.name}</p>
              <button class="btn btn-outline-danger btn-sm btn-show-profile" data-toggle="modal" data-target="#profile-modal" data-id="${item.id}">
                Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * USERS_PER_PAGE
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}

function showProfileModal(id) {
  const modalAvatar = document.querySelector("#profile-modal-image");
  const modalTitle = document.querySelector("#profile-modal-title");
  const modalGender = document.querySelector("#show-gender");
  const modalBirthday = document.querySelector("#show-birthday");
  const modalAge = document.querySelector("#show-age");
  const modalRegion = document.querySelector("#show-region");
  const modalEmail = document.querySelector("#show-email");
  const modalFooter = document.querySelector(".modal-footer");

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data;
    modalAvatar.innerHTML = `<img src="${data.avatar}" alt="movie-poster" class="image-fluid modal-image">`;
    modalTitle.innerText = `${data.name} ${data.surname}`;
    modalGender.innerText = `Gender: ${data.gender}`;
    modalBirthday.innerText = `Birthday: ${data.birthday}`;
    modalAge.innerText = `Age: ${data.age}`;
    modalRegion.innerText = `Region: ${data.region}`;
    modalEmail.innerText = `E-mail: ${data.email}`;

    modalFooter.innerHTML = `<button class="btn btn-danger btn-sm btn-add-favorite" data-id="${data.id}">Add to Favorite</button>
          <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>`
  });
}

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderUserList(getUsersByPage(page))
})

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-profile")) {
    showProfileModal(Number(event.target.dataset.id));
  }
});

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword) || user.region.toLowerCase().includes(keyword)
  )

  if (filteredUsers.length === 0) {
    return alert(`The name ${keyword} eneterd is not found`)
  }
  renderPaginator(filteredUsers.length)
  renderUserList(getUsersByPage(1))
})

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const user = users.find(user => user.id === id)

  if (list.some(user => user.id === id)) {
    return alert('This user is already in your favorite')
  }
  list.push(user)
  localStorage.setItem('favoriteUsers', JSON.stringify(list))
}

profileModal.addEventListener('click', function onAddFavoriteClicked(event) {
  if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

axios.get(INDEX_URL).then((response) => {
  users.push(...response.data.results);
  renderPaginator(users.length)
  renderUserList(getUsersByPage(1));
}).catch((err) => console.log(err))


