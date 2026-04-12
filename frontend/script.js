function saveMood() {
    const mood = document.getElementById("mood").value;

    if (mood === "") {
        alert("Please enter your mood");
        return;
    }

    alert("Mood saved: " + mood);
}