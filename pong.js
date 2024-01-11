const spielCanvas = document.getElementById('pong') // Referenz zur Canvas
const kontext = spielCanvas.getContext('2d') // 2D Kontext von unserer Canvas

// Breite bzw. Höhe der Schläger
const schlaegerBreite = 20
const schlaegerHoehe = 100

// KeyCodes für die Pfeiltasten
const pfeiltasteOben = 38
const pfeiltasteUnten = 40

// Schläger
let schlaegerXPosition = 100
let schlaegerYPosition = (spielCanvas.height / 2) - (schlaegerHoehe / 2)
let schlaegerYGeschwindigkeit = 0
const schlaegerBewegungsgeschwindigkeit = 5

// Schläger 2 (Computer)
let schlaeger2XPosition = spielCanvas.width - 100
let schlaeger2YPosition = (spielCanvas.height / 2) - (schlaegerHoehe / 2)
let schlaeger2YGeschwindigkeit = 0

// Variablen für den Ball
const ballGroesse = 20 // Breite und Höhe des Balls (es ist ein Quader, die beide Werte sind gleich)
let ballXPosition = (spielCanvas.width / 2) - (ballGroesse / 2) // Mitte der Canvas (X-Achse)
let ballYPosition = (spielCanvas.height / 2) - (ballGroesse / 2) // Mitte der Canvas (Y-Achse)
let ballXGeschwindigkeit = -5
let ballYGeschwindigkeit = -5

let menschPunkten = 0 // Punkten des Spielers
let computerPunkten = 0 // Punkte des Computers

kontext.fillStyle = 'white' // Wir werden alle Figuren weiß zeichnen, also mussen wir die Farbe nur einmal einstellen
kontext.strokeStyle = 'white'
kontext.lineWidth = 2
kontext.font = "50px Arial"

window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

// Eine Funktion, die einen weißen Rechteck zeichnet
function zeichneRechteck(xPosition, yPosition, breite, hoehe) {
	kontext.beginPath()
	kontext.rect(xPosition, yPosition, breite, hoehe)
	kontext.fill()
}

// Zeichnet eine Linie von A nach B
function zeichneLinie(aX, aY, bX, bY) {
    kontext.beginPath()
    kontext.moveTo(aX, aY)
    kontext.lineTo(bX, bY)
    kontext.stroke()
}

// Controller für den Schläger
document.onkeydown = function(event) {
	if(event.keyCode === pfeiltasteOben) {
		schlaegerYGeschwindigkeit = -schlaegerBewegungsgeschwindigkeit // Negative Geschwindigkeit = nach oben gehen
	} else if(event.keyCode === pfeiltasteUnten) {
		schlaegerYGeschwindigkeit = schlaegerBewegungsgeschwindigkeit
	}
}

// Wenn der Spieler eine Taste loslässt, dann soll der Schläger aufhören, sich zu bewegen
document.onkeyup = function(event) {
	schlaegerYGeschwindigkeit = 0
}

function ballAbprall() {
    if(ballYPosition <= 0) {
        // Abprall ab dem oberem Rand (soll jetzt nach unten gehen)
        ballYGeschwindigkeit = Math.abs(ballYGeschwindigkeit)
    } else if((ballYPosition + ballGroesse) >= spielCanvas.height) {
        // Abprall ab dem unterem Rand (soll jetzt nach oben gehen)
        ballYGeschwindigkeit = -Math.abs(ballYGeschwindigkeit)
    }
}

// Setzt den Ball zurück
function ballZurueckstzen() {
    ballXPosition = (spielCanvas.width / 2) - (ballGroesse / 2) // Mitte der Canvas (X-Achse)
    ballYPosition = (spielCanvas.height / 2) - (ballGroesse / 2) // Mitte der Canvas (Y-Achse)
    ballXGeschwindigkeit = -5
    ballYGeschwindigkeit = -5
}

// Prüft, ob der Spieler oder das Computer getroffen hat
function ballGetroffen() {
    if(ballXPosition < 0) {
        computerPunkten++ // Der Computer hat getroffen!
        ballZurueckstzen()
    } else if(ballXPosition > spielCanvas.width) {
        menschPunkten++ // Der Mensch hat getroffen!
        ballZurueckstzen()
    }
}

function ballSchlaegerAbprall() {
    if(
            ballXPosition <= (schlaegerXPosition + schlaegerBreite)
            && (ballYPosition + ballGroesse) >= schlaegerYPosition
            && ballYPosition <= (schlaegerYPosition + schlaegerHoehe)
            && (ballXPosition + ballGroesse) >= schlaegerXPosition) {
        ballXGeschwindigkeit = Math.abs(ballXGeschwindigkeit)
    } else if(
        // Computer-Schläger
            (ballXPosition + ballGroesse) >= schlaeger2XPosition
            && (ballYPosition + ballGroesse) >= schlaeger2YPosition
            && ballYPosition <= (schlaeger2YPosition + schlaegerHoehe)
            && ballXPosition <= (schlaeger2XPosition + schlaegerBreite)) {
        ballXGeschwindigkeit = -Math.abs(ballXGeschwindigkeit)
    }
}

function spielschleife() {
    if((ballYPosition + ballGroesse / 2) < (schlaeger2YPosition + schlaegerHoehe / 2)) {
        schlaeger2YGeschwindigkeit = -schlaegerBewegungsgeschwindigkeit // Bewege nach oben, wenn der ball höher ist
    } else if((ballYPosition + ballGroesse / 2) > (schlaeger2YPosition + schlaegerHoehe / 2)) {
        schlaeger2YGeschwindigkeit = schlaegerBewegungsgeschwindigkeit // Bewege nach unten, wenn der ball niedriger ist
    }

	// Verschiebe den Schläger, WENN er sich nach OBEN bewegt UND NICHT am OBEREN
    // RAND ist, ODER WENN es sich nach UNTEN bewegt UND NICHT am UNTEREN RAND ist.
    if( ( schlaegerYGeschwindigkeit < 0 && schlaegerYPosition > 0 ) || ( schlaegerYGeschwindigkeit > 0 && (schlaegerYPosition + schlaegerHoehe) < spielCanvas.height ) ) {
        // Aktualisiere die Position des Schlägers in Abhängigkeit von seiner Geschwindigkeit
        schlaegerYPosition += schlaegerYGeschwindigkeit
    }

    if((schlaeger2YGeschwindigkeit < 0 && schlaeger2YPosition > 0) || ( schlaeger2YGeschwindigkeit > 0 && (schlaeger2YPosition + schlaegerHoehe) < spielCanvas.height)) {
        // Aktualisiere die Position des Schlägers in Abhängigkeit von seiner Geschwindigkeit
        schlaeger2YPosition += schlaeger2YGeschwindigkeit
    }

    // Aktualisiere die Position des Balles in Abhängigkeit von seiner Geschwindigkeit
    ballXPosition += ballXGeschwindigkeit
    ballYPosition += ballYGeschwindigkeit

    ballAbprall()
    ballGetroffen()
    ballSchlaegerAbprall()

    // Lösche die Canvas bevor andere Objekte gezeichnet werden können
	kontext.clearRect(0, 0, spielCanvas.width, spielCanvas.height)

    zeichneLinie(spielCanvas.width/2, 0, spielCanvas.width/2, spielCanvas.height)

    // Punktezahlen zeigen
    kontext.textAlign = 'right'
    kontext.fillText(menschPunkten, spielCanvas.width/2 - 20, 50) // Spieler
    kontext.textAlign = 'left'
    kontext.fillText(computerPunkten, spielCanvas.width/2 + 20, 50) // Computer

    // Zeichne den Schläger des Spielers
	zeichneRechteck(schlaegerXPosition, schlaegerYPosition, schlaegerBreite, schlaegerHoehe) 

    // Zeichne den Schläger der Computer
	zeichneRechteck(schlaeger2XPosition, schlaeger2YPosition, schlaegerBreite, schlaegerHoehe) 

    // Zeichne den Ball
    zeichneRechteck(ballXPosition, ballYPosition, ballGroesse, ballGroesse)

    // Anfrage für das nächste Bild
	window.requestAnimationFrame(spielschleife)
}

spielschleife() // Startet die Spielschleife
