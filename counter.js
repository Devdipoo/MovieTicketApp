// Constructor for MovieTicketApp
function MovieTicketApp() {
  this.movies = {};
  this.bookings = {};
  this.currentMovieId = 0;
  this.currentBookingId = 0;
}

// MovieTicketApp.prototype.addMovie = function(movie) {
//   movie.id = this.assignMovieId();
//   this.movies[movie.id] = movie;
};

MovieTicketApp.prototype.assignMovieId = function() {
  this.currentMovieId += 1;
  return this.currentMovieId;
};

MovieTicketApp.prototype.addBooking = function(booking) {
  booking.id = this.assignBookingId();
  this.bookings[booking.id] = booking;
};

MovieTicketApp.prototype.assignBookingId = function() {
  this.currentBookingId += 1;
  return this.currentBookingId;
};

MovieTicketApp.prototype.findBooking = function(id) {
  if (this.bookings[id] != undefined) {
      return this.bookings[id];
  }
  return false;
};

MovieTicketApp.prototype.deleteBooking = function(id) {
  if (this.bookings[id] === undefined) {
      return false;
  }
  delete this.bookings[id];
  return true;
};

// Constructor for Movie
function Movie(name) {
  this.name = name;
}

// Constructor for Booking
function Booking(movieName, showtime, quantity, price) {
  this.movieName = movieName;
  this.showtime = showtime;
  this.quantity = quantity;
  this.price = price;
  this.totalCost = this.calculateTotalCost();
}

Booking.prototype.calculateTotalCost = function() {
  return this.quantity * this.price;
}

// User Interface Logic
let movieTicketApp = new MovieTicketApp();

function displayBookingDetails(appToDisplay) {
  let bookingsList = $("ul#all-bookings");
  let htmlForBookingInfo = "";
  Object.keys(appToDisplay.bookings).forEach(function(key) {
      const booking = appToDisplay.findBooking(key);
      htmlForBookingInfo += `<li class="list-group-item" id="${booking.id}">
          <strong>${booking.movieName}</strong> - ${booking.showtime} - ${booking.quantity} tickets - Total Cost: $${booking.totalCost}
          <button class="btn btn-danger btn-sm float-end delete-button" data-id="${booking.id}">Delete</button>
      </li>`;
  });
  bookingsList.html(htmlForBookingInfo);
}

function updateMovieSelectList() {
  let movieSelect = $("#select-movie");
  movieSelect.empty();
  movieSelect.append('<option value="" disabled selected>Select a movie</option>');
  Object.values(movieTicketApp.movies).forEach(function(movie) {
      movieSelect.append(`<option value="${movie.name}">${movie.name}</option>`);
  });
}

$(document).ready(function() {
  $("form#add-movie-form").submit(function(event) {
      event.preventDefault();
      const inputtedMovieName = $("input#movie-name").val();
      let newMovie = new Movie(inputtedMovieName);
      movieTicketApp.addMovie(newMovie);
      updateMovieSelectList();
      $("#add-movie-form")[0].reset();
  });

  $("form#book-ticket-form").submit(function(event) {
      event.preventDefault();
      const selectedMovieName = $("#select-movie").val();
      const inputtedShowtime = $("input#showtime").val();
      const inputtedQuantity = $("input#quantity").val();
      const ticketPrice = parseFloat($("#ticket-price").val());
      let newBooking = new Booking(selectedMovieName, inputtedShowtime, parseInt(inputtedQuantity), ticketPrice);
      movieTicketApp.addBooking(newBooking);
      displayBookingDetails(movieTicketApp);
      $("#book-ticket-form")[0].reset();
  });

  // Event delegation for deleting bookings
  $("ul#all-bookings").on("click", ".delete-button", function() {
      const id = $(this).data("id");
      movieTicketApp.deleteBooking(id);
      displayBookingDetails(movieTicketApp);
  });
});
