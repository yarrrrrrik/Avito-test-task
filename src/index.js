import './scss/style.scss'
import {bigRepoCard} from './card_page'

class Repo {
  constructor(name,stars,updated,link) {
      this.name = name;
      this.stars = stars;
      this.updated = updated;
      this.link = link;
  }
}

let model = {
  response:'',

  reposArr:[],
// curl 'https://api.github.com/user/repos?page=2&per_page=100'

  pushReposToArr: (reposArr,response) => {

  },

  getRepos: async (searchValue = 'stars:>0',page = '1') => {
    model.response = ''

    model.reposArr = []
    console.log(searchValue);
    console.log(page);
    // https://api.github.com/search/repositories?q=stars:%3E0&sort=stars&order=desc&page=1
    let request = await fetch(`https://api.github.com/search/repositories?q=${searchValue}&sort=stars&order=desc&page=${page}&per_page=10`)
    model.response = await request.json()
    model.response.items.forEach((item, i) => {
        let repo = new Repo(item.name,item.stargazers_count,item.updated_at,item.html_url)
        model.reposArr.push(repo)
    });
  },
}
// item.name item.stargazers_count item.updated_at item.html_url
let view = {
  inputValue:undefined,
  makeRepoNodeElement:(repo) => {
    // let repo = new Repo(title,stars,date,link)
    let repoNode = document.createElement('div')
    repoNode.classList.add('repo-card')

    let repoName = document.createElement('h3')
    repoName.innerHTML = `${repo.name}`
    let repoStars = document.createElement('p')
    repoStars.innerHTML = `★${repo.stars}`
    let repoUpdated = document.createElement('p')
    repoUpdated.innerHTML = `${repo.updated}`
    let repoLink = document.createElement('a')
    repoLink.classList.add('card-link')
    repoLink.innerHTML = 'Заглянуть'

    // repoLink.href = `${repo.link}`

    repoLink.addEventListener('click',(e) => {
      document.querySelector('.block').classList.add('hidden')
    })
    repoNode.appendChild(repoName)
    repoNode.appendChild(repoStars)
    repoNode.appendChild(repoUpdated)
    repoNode.appendChild(repoLink)

    document.querySelector('.items').appendChild(repoNode)
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
      view.makeRepoNodeElement(item)
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
    // console.log(e.target.innerText);
    // controller.method(e.target.innerText)
    let element = document.querySelector('.items')
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }

    // await model.getRepos(searchValue)
    // await model.reposArr.forEach((item, i) => {
    //   view.makeRepoNodeElement(item)
    // });
    // console.log(view.inputValue);
    controller.getRepos(view.inputValue,e.target.innerText)
    console.log(typeof view.inputValue);
    // model.reposArr.forEach((item, i) => {
    //     view.makeRepoNodeElement(item)
    // })
    },
  }

controller.getRepos()
view.inputEvent()
view.paginationEvents()
