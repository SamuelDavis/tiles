class TokenSelectedEvent extends Event {
  static KEY = 'TokenSelected'
  token

  constructor (token) {
    super(TokenSelectedEvent.KEY)
    this.token = token
  }
}

class Token {
  id
  el

  constructor (id = 0, x = 0, y = 0) {
    this.el = document.createElement('div')
    this.el.classList.add('Token')
    this.el.oncontextmenu = () => false
    this.el.addEventListener('click', (e) => {
      e.stopPropagation()
      window.dispatchEvent(new TokenSelectedEvent(this))
    })
    this.el.innerText = id

    this.id = id
    this.x = x
    this.y = y
  }

  set x (value) {
    this.el.style.left = `${Math.floor(value)}em`
  }

  set y (value) {
    this.el.style.top = `${Math.floor(value)}em`
  }

  set selected (value) {
    value
      ? this.el.classList.add('selected')
      : this.el.classList.remove('selected')
  }
}

window.addEventListener('DOMContentLoaded', function () {
  let selected = null
  const tokens = ['fo', 'ba'].map(id => new Token(id, Math.random() * 10, Math.random() * 10))
  const viewport = document.getElementById('viewport')
  const ui = document.getElementById('ui')
  const scale = parseInt(window.getComputedStyle(viewport).fontSize)
  tokens.forEach(token => viewport.appendChild(token.el))

  viewport.addEventListener('click', function (e) {
    switch (e.button) {
      case 0:
        window.dispatchEvent(new TokenSelectedEvent(null))
        break
    }
  })

  viewport.addEventListener('contextmenu', function (e) {
    if (e.target !== viewport)
      return
    if (selected) {
      selected.x = e.offsetX / scale
      selected.y = e.offsetY / scale
    }
  })

  window.addEventListener(TokenSelectedEvent.KEY, function (e) {
    selected = e.token
    tokens.forEach(token => {
      token.selected = e.token && token.el === e.token.el
    })

    ui.innerText = e.token ? `Selected: ${e.token.id}` : null
  })
})
