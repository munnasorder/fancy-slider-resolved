const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const errorMessage = document.getElementById('error-message');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })
  
  loadingSpinner();

}

const getImages = (query) => {
  loadingSpinner();
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
  .then(data => {
    error(data.total);
    showImages(data.hits);
  })
    .catch(err => {
      console.log(err.message);
    })
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  
  let item = sliders.indexOf(img);
  if (item === -1) {
    element.classList.add('added');
    element.classList.remove('remove');
    sliders.push(img);
  } else {
    element.classList.add('remove');
    element.classList.remove('added');
    sliders.pop(img)
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  const durationValue = document.getElementById('duration').value;
  const duration = durationValue || '1000';

  if( durationValue > 0 || duration === '1000') {

    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item)
    })
    changeSlide(0)
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  }
  if(duration <= 0){
    alert('Sorry duration is not valid');
    location.reload();
    
  }
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

document.getElementById('search').addEventListener('keydown', ({key}) => {
  if (key === 'Enter') {
    showResults();
  }
})

searchBtn.addEventListener('click', showResults)

function showResults() {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
}

sliderBtn.addEventListener('click', function () {
  createSlider()
})

const loadingSpinner = () => {
  const spinner = document.getElementById('loading-spiner');
  spinner.classList.toggle('d-block');
  gallery.classList.toggle('d-none');
}

function error (data) {
  if (data == 0) {
    errorMessage.classList.remove('d-none');
  }else{
    errorMessage.classList.add('d-none');
  }
}