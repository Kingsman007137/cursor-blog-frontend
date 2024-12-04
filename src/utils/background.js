let lastNum = -1

export function setRandomBackground() {
  const randomNum = Math.floor(Math.random() * 11)
  if (randomNum === lastNum) {
    setRandomBackground()
    return
  }
  lastNum = randomNum
  const imageUrl = new URL(`../assets/${randomNum}.png`, import.meta.url).href
  const img = new Image()
  img.onload = () => {
    document.body.style.opacity = '0'
    document.body.style.backgroundImage = `url(${imageUrl})`
    setTimeout(() => {
      document.body.style.opacity = '1'
    }, 50)
  }
  img.src = imageUrl
} 