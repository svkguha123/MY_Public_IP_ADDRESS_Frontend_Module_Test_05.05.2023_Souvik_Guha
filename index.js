let ipAddress = "";
let ipTag = document.querySelector("h3");
let token = "4d3ea27c2aa2ee";
let ipData = "";
let map = document.getElementById("map");
let latitude = "";
let longitude = "";
let postalData = ""
let postalElement = document.querySelector(".postal-data");

async function getIp() {
    ipAddress = await fetch("https://api.ipify.org?format=json")
        .then(response => response.json())
        .then(data => data.ip);
}

getIp()
    .then(() => {
        ipTag.innerText += ipAddress;
    })

async function getData() {
    ipData = await fetch(`https://ipinfo.io/${ipAddress}?token=${token}`)
        .then((response) => response.json())
        .then((data) => 
            ipData = data
        );
    latitude = ipData.loc.split(",")[0];
    longitude = ipData.loc.split(",")[1];
    console.log(latitude, longitude);
}

function getCurrentTime(timeZone) {
    let now = new Date();

    // Create options object with specified time zone
    let options = {
        timeZone: timeZone,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    // Format the date and time according to the options
    const formatter = new Intl.DateTimeFormat([], options);
    let dateAndTime = formatter.format();

    // Return the formatted date and time
    return dateAndTime;
}

async function getPostalData(pin) {
    return await fetch(`https://api.postalpincode.in/pincode/${pin}`)
        .then((response) => response.json());
}

document.getElementById("getData").addEventListener("click", (e) => {
    let button = e.target;
    button.style.display = "none";
    document.querySelector(".second").style.display = "block"

    getData().then(() => {
        console.log(ipData);
        document.getElementById("lat").innerHTML += latitude;
        document.getElementById("long").innerHTML += longitude;
        document.getElementById("city").innerHTML += ipData.city;
        document.getElementById("org").innerHTML += ipData.org;
        document.getElementById("region").innerHTML += ipData.region;
        document.getElementById("host").innerHTML += ipData.hostname;
        document.getElementById("time").innerHTML += ipData.timezone;
        document.getElementById("pin").innerHTML += ipData.postal;
        document.getElementById("date").innerHTML += getCurrentTime(ipData.timezone);

        getPostalData(ipData.postal).then((data) => {
            postalData = data[0];
            document.getElementById("message").innerHTML += postalData.Message;
            console.log(postalData);
            renderItems(postalData.PostOffice)
        })

        map.src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;


    });

});

function renderItems(data) {
    let innerHtml = "";
    postalElement.innerHTML = ""
    data.forEach((i) => {
        innerHtml += `<div class="item">
        <p>Name : ${i.Name}</p>
        <p>Branch Type : ${i.BranchType}</p>
        <p>Delivery Status : ${i.DeliveryStatus}</p>
        <p>District : ${i.District}</p>
        <p>Division : ${i.Division}</p>
    </div>`
    })

    postalElement.innerHTML += innerHtml
}

document.getElementById("search").addEventListener("input", (e) => {
    let input = e.target.value.trim();
    renderItems(postalData.PostOffice.filter((i) => i.Name.toLowerCase().includes(input) || i.BranchType.toLowerCase().includes(input)))

})
