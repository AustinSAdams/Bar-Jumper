/* This page is for the "/rankings" extension on the website. It should have:
    1. Default Theme Colors.
    2. Easy to navigate menu.
    3. "Leader Board" display with bars ranked by stars on google analytics.
        Additionally, there should be buttons under each ranking that leads to 
        main page with that bar's information pulled up automatically.

    To access this page locally, after running "npm run dev", go into your web browser
    and type in "http://localhost:3000/rankings".
*/

export default function rankingsPage(){
    const locations = [
        { name: "Dawg House", rating: 5 },
        { name: "Ponchatoulas", rating: 4 },
        { name: "Ruston Revelry", rating: 3 }
    ];

    const renderStars = (count) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={index < count ? 'star filled' : 'star'}>★</span>
        ));
    };

    return (
        <div className="rankings-container">
            {locations.map((location, index) => (
                <div key={index} className="rectangle">
                    {location.name} {renderStars(location.rating)}
                    <button className="locate-button">Locate</button>
                </div>
            ))}
        </div>
);
}
/*<div className="rankings-container">
<div className="rectangle">Dawg House</div>
<div className="rectangle">Ponchatoulas</div>
<div className="rectangle">Revelry</div>
</div>

/*const container = document.createElement('div');
container.className = 'container';

const rectangles = [
    { title: 'Ponchatoulas', imageUrl: 'https://placeholder'},
    { title: 'Dawg House', imageUrl: 'https://placeholder'},
    { title: 'Revelry of Ruston', imageUrl: 'https://placeholder'},
    { title: 'Placeholder', imageUrl: 'https://placeholder'},
];

function toggleImage(index) {
    const img = container.querySelectorAll('img')[index];
    img.classList.toggle('hidden');
}

rectangles.forEach((rect, index) => {
    const rectangle = document.createElement('div');
    rectangle.className = 'rectangle';
    rectangle.onclick = () => toggleImage(index);

    const title = document.createElement('h3');
    title.textContext = rect.title;

    const arrow = document.createElement('span');
    arrow.className = 'arrow';
    arrow.textContent = '▼';

    const img =  document.createElement('img');
    img.src = rect.imageUrl;
    img.alt = rect.title;
    img.className = 'hidden';

    rectangle.appendChild(title);
    rectangle.appendChild(arrow);
    rectangle.appendChild(img);
    container.appendChild(rectangle);
});

document.body.appendChild(container); */