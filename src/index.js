import './scss/style.scss'
import {bigRepoCard} from './card_page'

class Repo {
  constructor(name,stars,updated,link,avatar_url,login,description,contributors_url,languages_url) {
      this.name = name;
      this.stars = stars;
      this.updated = updated;
      this.link = link;
      this.description = description;
      this.contributors_url = contributors_url;
      this.languages_url = languages_url;
      this.avatar_url = avatar_url;
      this.login = login;
      this.languages = '';
      this.contributors = ''
  }
}

let model = {
  response:'',
  reposArr:[],

  getRepos: async (searchValue = 'stars:>0',page = '1') => {
    model.response = ''
    model.reposArr = []

    let request = await fetch(`https://api.github.com/search/repositories?q=${searchValue}&sort=stars&order=desc&page=${page}&per_page=10`)
    model.response = await request.json()
    model.response.items.forEach((item, i) => {
        let repo = new Repo(item.name,item.stargazers_count,item.updated_at,item.html_url,item.owner.avatar_url,item.owner.login,item.description,item.contributors_url,item.languages_url)
        model.reposArr.push(repo)
    });
  },
  getRepoCardInfo: async (repo) => {
    let languages = await fetch(repo.languages_url)
    repo.languages = await languages.json()

    let contributors = await fetch(repo.contributors_url)
    repo.contributors = await contributors.json()
  }
}

let view = {
  inputValue:undefined,

  makeRepoNodeElement:(repo,i) => {
    let repoNode = document.createElement('div')
    repoNode.classList.add('repo-card')
    let repoName = document.createElement('h3')
    repoName.innerHTML = `${repo.name}`
    let repoStars = document.createElement('p')
    repoStars.innerHTML = `★${repo.stars}`
    let repoUpdated = document.createElement('p')
    repoUpdated.innerHTML = `${repo.updated}`
    let repoLink = document.createElement('a')
    repoLink.addEventListener('click',controller.openCardEvent)
    repoLink.classList.add(`card-link`)
    repoLink.id = i
    repoLink.innerHTML = 'Заглянуть'
    repoLink.addEventListener('click',(e) => {
      document.querySelector('.block').classList.add('hidden')
    })
    repoNode.appendChild(repoName)
    repoNode.appendChild(repoStars)
    repoNode.appendChild(repoUpdated)
    repoNode.appendChild(repoLink)
    document.querySelector('.items').appendChild(repoNode)
  },
  makeRepoCardNodeElement:(repo) => {
    let repoNode = document.createElement('div')
    repoNode.classList.add('repo-big-card')
    repoNode.insertAdjacentHTML('afterbegin',`
      <div class="repo-big-card__header">
        <a href="">Назад</a>
        <h3>${repo.name}</h3>
        <p>★${repo.stars}</p>
        <p>${repo.updated_at}</p>
      </div>
      <div class="repo-big-card__user">
        <img src="${repo.avatar_url}" alt="">
        <a href="#">${repo.login}</a>
      </div>
      <div class="repo-big-card__description">
        <div class="languages">
        </div>
        <div class="repo-big-card__info">
          <p>${repo.description}</p>
        </div>
        <div class="contributors"></div>
      </div>
    `)
    document.querySelector('body').appendChild(repoNode)

    for (let key in repo.languages){
      let langEl = document.createElement('p')
      langEl.innerText = key
      document.querySelector('.languages').appendChild(langEl)
    }


    repo.contributors.forEach((item, i) => {
      if(i<11){
        let contributerEl = document.createElement('a')
        contributerEl.innerText = item.login
        contributerEl.href = item.html_url
        document.querySelector('.contributors').appendChild(contributerEl)
      }
    });



    // let repoHeader = document.createElement('div')
    // repoHeader.classList.add('repo-big-card__header')
    // let repoName = document.createElement('h3')
    // repoName.innerHTML = `${repo.name}`
    // let repoStars = document.createElement('p')
    // repoStars.innerHTML = `★${repo.stars}`
    // let repoUpdated = document.createElement('p')
    // repoUpdated.innerHTML = `${repo.updated}
    // let repoUser = document.createElement('div')
    // repoUser.classList.add('repo-big-card__user')
    // let repoAvatar = document.createElement('img')
    // repoAvatar.src = repo.avatar_url
    // let repoLogin = document.createElement('a')
    // repoLogin = document.createElement()

  },
  inputEvent:() => {
    document.querySelector('#search-btn').addEventListener('click',controller.inputEvent)
  },
  paginationEvents:() => {
    let pageButtons = document.querySelectorAll('.pagination_button')
    pageButtons.forEach((item, i) => {
      item.addEventListener('click',controller.paginationEvents)
      item.addEventListener('focus',(e) => {
        e.target.classList.toggle('active-btn')
      })
      item.addEventListener('blur',(e) => {
        e.target.classList.remove('active-btn')
      })
    });

  }

}

let controller = {
  getRepos: async (searchValue,page) => {
    await model.getRepos(searchValue,page)
    await model.reposArr.forEach((item, i) => {
      view.makeRepoNodeElement(item,i)
    });
  },
  inputEvent:() => {
    document.querySelector('#search').value.length > 0 ? view.inputValue = document.querySelector('#search').value : ''

    controller.getRepos(view.inputValue)

    let element = document.querySelector('.items')
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  },
  paginationEvents: async (e) => {
    let element = document.querySelector('.items')
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    controller.getRepos(view.inputValue,e.target.innerText)
    },
  openCardEvent:async (e) => {
    await model.getRepoCardInfo(model.reposArr[e.target.id])
    await view.makeRepoCardNodeElement(model.reposArr[e.target.id])
    console.log(model.reposArr[e.target.id]);
    // await console.log(model.reposArr);
  }
  }

controller.getRepos()
view.inputEvent()
view.paginationEvents()
