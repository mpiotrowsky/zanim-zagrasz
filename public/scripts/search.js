$('#game-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/games?' + search, function(data) {
    $('#game-grid').html('');
    data.forEach(function(game) {
      $('#game-grid').append(`
        <div class="col-md-3 col-sm-6">
          <div class="thumbnail">
            <img src="${ game.image }">
            <div class="caption">
              <h4>${ game.name }</h4>
            </div>
            <p>
              <a href="/games/${ game._id }" class="btn btn-primary">Więcej</a>
            </p>
          </div>
        </div>
      `);
    });
  });
});

$('#game-search').submit(function(event) {
  event.preventDefault();
});