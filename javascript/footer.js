function createFooter() {
  const playButton = $w('<button>');
  playButton.attr('id', 'play');
  playButton.addClass("play");
  playButton.html('▶︎');

  const modeButton = $w('<button>');
  modeButton.attr('id', 'mode');
  modeButton.addClass("major");
  modeButton.html('M');

  const demoButton = $w('<button>');
  demoButton.addClass("demo");
  demoButton.html('D');

  const clearButton = $w('<button>');
  clearButton.addClass("clear");
  clearButton.html('C');

  const footer = $w('<footer>');

  footer.append(playButton);
  footer.append(modeButton);
  footer.append(demoButton);
  footer.append(clearButton);

  createLinks(footer);
  $w('body').append(footer);
}

function createLinks(footer) {
  const links = $w('<div>');
  links.addClass('links');

  const gitLink = $w("<a>");
  gitLink.attr('target', '_blank');
  gitLink.attr('href', "https://www.github.com/miphnoel/tuneLoop");
  const gitIcon = $w('<i>');
  gitIcon.addClass('fa');
  gitIcon.addClass('fa-github');
  gitIcon.attr('aria-hidden', 'true');
  gitLink.append(gitIcon);
  links.append(gitLink);

  const linkedInLink = $w('<a>');
  linkedInLink.attr('target', '_blank');
  linkedInLink.attr('href', "https://www.linkedin.com/in/michael-noel");
  const linkedInIcon = $w('<i>');
  linkedInIcon.addClass('fa');
  linkedInIcon.addClass('fa-linkedin-square');
  linkedInIcon.attr('aria-hidden', 'true');
  linkedInLink.append(linkedInIcon);
  links.append(linkedInLink);

  const portfolioLink = $w('<a>');
  portfolioLink.attr('target', '_blank');
  portfolioLink.attr('href', "http://www.michaelnoel.us");
  const portfolioIcon = $w('<i>');
  portfolioIcon.addClass('fa');
  portfolioIcon.addClass('fa-address-card');
  portfolioIcon.attr('aria-hidden', 'true');
  portfolioLink.append(portfolioIcon);
  links.append(portfolioLink);

  footer.append(links);
}

export default createFooter;
