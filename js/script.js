'use strict';
const templates = {
  articleLink: Handlebars.compile(
    document.querySelector('#template-article-link').innerHTML
  ),
  articleTagLink: Handlebars.compile(
    document.querySelector('#template-article-tag-link').innerHTML
  ),
  authorLink: Handlebars.compile(
    document.querySelector('#template-author-link').innerHTML
  ),
  tagCloudLink: Handlebars.compile(
    document.querySelector('#template-tag-cloud-link').innerHTML
  ),
  authorCloudLink: Handlebars.compile(
    document.querySelector('#template-author-cloud-link').innerHTML
  ),
};

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  // console.log('Link was clicked!');
  // console.log(event);

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* add class 'active' to the clicked link */
  // console.log('clickedElement: (with plus) ' + clickedElement);
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('article.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  // console.log(articleSelector);
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  // console.log(targetArticle);
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}

//5.4 Generowanie listy tytułów
//ustawienia skryptu w stałych - łatwość zmiany nazw klas w HTML
const optArticleSelector = '.post', //article
  optTitleSelector = '.post-title', //article>h3
  optTitleListSelector = '.titles', //ul>titles
  optArticleTagsSelector = '.post-tags .list', //<ul>
  optArticleAuthorSelector = '.post-author', //author's name in article
  optTagListSelector = '.list.tags',
  optAuthorListSelector = '.list.authors';
const optCloudClassCount = 5;
const optCloudClassPrefix = '.tag-size-';

function generateTitleLinks(customSelector = '') {
  /*remove contents of titleList*/
  const titleList = document.querySelector(optTitleListSelector);
  //czyszczenie zawartości elementu
  titleList.innerHTML = '';
  let html = '';
  /* for each article */
  const articles = document.querySelectorAll(
    optArticleSelector + customSelector
  ); // if tag "cat" is clicked, article will retrieve '[data-tags~="cat"]'
  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    // console.log(article);
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */
    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);
    // console.log('linkHTML');
    /* insert link into titleList */
    titleList.innerHTML = titleList.innerHTML + linkHTML;

    /* insert link into html variable */
    html = html + linkHTML;
    // console.log(html);
  }

  const links = document.querySelectorAll('.titles a');
  // console.log(links);
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();

//6.2 - Generate tags
function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedRange = params.max - params.min;
  const percentage = normalizedCount / normalizedRange;
  const classNumber = Math.floor(percentage * (tagClassNames.length - 1));
  return tagClassNames[classNumber];
}

function generateTags() {
  // /*[NEW] create a new variable allTags with an empty array*/
  // let allTags = [];
  /*[NEW] create a new variable allTags with an empty array*/
  let allTags = {};
  /* find all articles */
  const allArticles = document.querySelectorAll(optArticleSelector);
  // console.log(allArticles);
  /* START LOOP: for every article: */
  for (let article of allArticles) {
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    // console.log(tagsWrapper);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    // console.log(articleTags);
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    // console.log(articleTagsArray);

    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      /* generate HTML of the link */
      const tagLinkHTML = templates.articleTagLink({ tag: tag });
      // const tagLinkHTML =
      //   '<li><a href="#tag-' + tag + '">' + tag + '</a> ' + '&nbsp;' + '</li>';
      /* add generated code to html variable */
      html = html + tagLinkHTML; //dodanie <br>
      //chec if this link is NOT alreday in allTags
      if (!allTags.hasOwnProperty(tag)) {
        //[NEW]add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      // /*[NEW] check if this link is not already in allTags*/

      // if (allTags.indexOf(tagLinkHTML) == -1)
      // /*[NEW] add generated code to allTags array*/
      // allTags.push(tagLinkHTML);
      // }
      /* END LOOP: for each tag */
      // console.log(tag);
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
    /* END LOOP: for every article: */
  }
  /*[NEW] find list of tags in right column*/
  const tagList = document.querySelector(optTagListSelector);
  // console.log(tagList);

  /*[NEW] add HTML from allTags to tagList*/
  // tagList.innerHTML = allTags.join(' ');
  // console.log(allTags);

  function calculateTagSize(tagSize) {
    const objectArray = Object.values(allTags);

    let max = 0;

    for (let item of objectArray) {
      if (item > max) {
        max = item;
      }
    }

    const size = Math.max(1, Math.round((tagSize / max) * 4));

    return size;
  }

  const tagsParams = calculateTagsParams(allTags);
  function calculateTagsParams(tags) {
    const params = {
      min: 1,
      max: 7,
    };

    for (let tag in tags) {
      if (tags[tag] < params.min) {
        params.min = tags[tag];
      }
      if (tags[tag] > params.max) {
        params.max = tags[tag];
      }
    }
    // console.log('Minimum tag count:', params.min);
    // console.log('Maximum tag count:', params.max);
    return params;
  }

  //[NEW] create variable for all links HTML code
  let allTagsHTML = '';
  // [NEW] START LOOP: for each tag in allTags
  for (let tag in allTags) {
    // [NEW] generate code of a link and add it to allTagsHTML
    allTagsHTML +=
      '<a class="tag-size-' +
      calculateTagSize(allTags[tag]) +
      '" href="#tag-' +
      tag +
      '">' +
      tag +
      ' (' +
      allTags[tag] +
      ') </a><br>';
    // const tagLinkClass = calculateTagClass(allTags[tag], tagsParams);
    // const tagLinkHTML =
    //   '<li>' + calculateTagClass(allTags[tag], tagsParams) + '<li>';
    // console.log('tagLinkHTML:', tagLinkHTML);              nie dziala !!!!!!!!!
  }
  // const tagLinkHTML =
  //   '<li>' + calculateTagClass(allTags[tag], tagsParams) + '<li>';
  // console.log('taglinkHTML:', tagLinkHTML);

  // [NEW] END LOOP: for each tag in allTags
  // [NEW] add html from allTagsHTML to tagList
  tagList.innerHTML = allTagsHTML;
}

generateTags();

//Akcja po kliknięciu w tag

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  // console.log(clickedElement);
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  // console.log(href);
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]'); //active tags

  /* START LOOP: for each active tag link */
  for (let tagLink of tagLinks) {
    /* remove class active */
    tagLinks.classList.remove('active');
    /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const linkHref = document.querySelector('a[href="' + href + '"]'); // can we use tagLink zamiast document?
  /* START LOOP: for each found tag link */
  for (let tagLink of tagLinks) {
    /* add class active */
    tagLink.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const allTagsLinks = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for (let allTagsLink of allTagsLinks) {
    /* add tagClickHandler as event listener for that link */
    allTagsLink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }
}

addClickListenersToTags();

/*Zadanie:dodanie autora do artykułu*/
function generateAuthors() {
  const allArticles = document.querySelectorAll(optArticleSelector);
  const authorList = document.querySelector(optAuthorListSelector);
  let allAuthors = {};

  for (let article of allArticles) {
    const articleAuthor = article.getAttribute('data-author');
    const authorWrapper = article.querySelector(optArticleAuthorSelector);

    //   const linkToHTMLData = { author: articleAuthor }; tutaj poprawić !!!!!!!
    //   const linkToHTM = templates.authorLink(linkToHTMLData);
    //   html = html + linkToHTM;

    //   if(!authorRightBar.hasOwnProperty(articleAuthor)){
    //     authorRightBar[articleAuthor] = 1;
    //   } else {
    //     authorRightBar[articleAuthor]++;  //jesli ten tag znajduje sie w allTags,zwiekszamy licznik wystapien o jeden
    //   }
    //   authorWrapper.innerHTML = html;
    // }
    const authorHTML =
      '<a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
    authorWrapper.innerHTML = authorHTML;

    if (!allAuthors.hasOwnProperty(articleAuthor)) {
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
  }

  let authorsHTML = '';
  for (let author in allAuthors) {
    authorsHTML +=
      '<li><a href="#author-' +
      author +
      '">' +
      author +
      ' (' +
      allAuthors[author] +
      ')</a></li>';
  }
  authorList.innerHTML = authorsHTML;
}

generateAuthors();

function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
  for (let activeAuthor of activeAuthors) {
    activeAuthor.classList.remove('active');
  }
  const authorLinks = document.querySelectorAll(
    'a[href="#author-' + author + '"]'
  );
  for (let authorLink of authorLinks) {
    authorLink.classList.add('active');
  }
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  const allAuthorLinks = document.querySelectorAll('a[href^="#author-"]');
  for (let authorLink of allAuthorLinks) {
    authorLink.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();
