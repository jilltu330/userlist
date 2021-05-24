const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";

const users = JSON.parse(localStorage.getItem('favoriteUsers'))

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector('#search-input')
const profileModal = document.querySelector('#profile-modal')

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
              <button class="btn btn-danger btn-sm btn-show-profile" data-toggle="modal" data-target="#profile-modal" data-id="${item.id}">
                Profile
              </button>
              <button class="btn btn-outline-secondary btn-sm btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
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

    modalFooter.innerHTML = `
          <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>`
  });
}

function removeFromFavorite(id) {
  if (!users) return

  const userIndex = users.findIndex(user => user.id === id)
  if (userIndex === -1) return

  users.splice(userIndex, 1)

  localStorage.setItem('favoriteUsers', JSON.stringify(users))
  renderUserList(users)
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-profile")) {
    showProfileModal(Number(event.target.dataset.id));
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
});

renderUserList(users)
