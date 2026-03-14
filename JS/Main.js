gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", function() {
    ScrollTrigger.refresh();
    
    let mm = gsap.matchMedia();

    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault(); 
        const btn = this.querySelector('button');
        btn.innerText = 'Sending...'; 
        const serviceID = 'service_dtestx8'; 
        const templateID = 'template_ezrlrup'; 

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                btn.innerText = 'Send Message';
                AlertSW("Success! Your message has been sent. 🚀");
                this.reset(); 
            }, (err) => {
                btn.innerText = 'Send Message';
                AlertSW("Failed to send. Please try again.", "error");
                console.error('EmailJS Error:', err);
            });
    });

    mm.add("(min-width: 800px)", () => {
        const heroImage = document.querySelector(".Hero-Image");
        const imagehero = document.querySelector(".Image-Hero");
        const h2_About = document.querySelector(".h2-About");
        const p_About = document.querySelector(".p-About");

        const tl = gsap.timeline();

        if(heroImage){
            tl.from(heroImage,{duration:1.2,opacity:0, y:50,ease:"power3.out"})
            .from(imagehero,{
                duration:1,
                scale:0.8,
                opacity:0,
                ease:"back.out(1.7)"
            },"-=0.5");
            
            tl.from(".Content-Hero h1", { x: 50, opacity: 0, duration: 0.8 }, "-=0.3")
            .from(".Content-Hero p", { x: 50, opacity: 0, duration: 0.8 }, "-=0.5")
            .from(".button-Hero", {
                x: 50,
                scale: 1,
                opacity: 0, 
                duration: 0.5,
                clearProps: "all"
            }, "-=0.3");

            gsap.to(".Image-Hero",{
                y:20,
                duration:1,
                repeat:-1,
                yoyo:true,
                ease:"sine.inOut"
            });
        }

        if(h2_About){
            const abouttl = gsap.timeline({
                scrollTrigger:{
                    trigger:".About-Us",
                    start:"top 60%",
                    toggleActions: "play none none none",
                }
            });
            abouttl.from(h2_About,{
                duration:1,
                opacity:0,
                y:50,
                ease:"power3.out"
            })
            .from(p_About,{
                duration:1.5,
                opacity:0,
                y:50,
                ease:"power3.out"
            },"-=0.8");
        }

        const productstl = gsap.timeline({
            scrollTrigger: {
                trigger: ".Products",
                start: "top 60%",
                toggleActions: "play none none none",
            }
        });
        productstl.to(".card", {
            duration: 1,
            opacity: 1,
            x: 0,
            y:0,
            stagger: 0.15, 
            ease: "power2.out",
            immediateRender: false
        });

        const contacttl = gsap.timeline({
            scrollTrigger:{
                trigger:"#contact-form",
                start:"top 60%",
                toggleActions: "play none none none",
            }
        });
        contacttl.to(".h2-contact1",{
            duration: 1,
            opacity: 1,
            x: 0,
            y:0,
            ease: "power4.out",
        })
        .to(".contact-container",{
            duration: 1,
            opacity: 1,
            x: 0,
            y:0,
            stagger: 0.2, 
            ease: "power4.out",
        });

        return () => {
            gsap.set(".card, .Hero-Image, .Image-Hero, .h2-About, .p-About, .contact-container", { 
                clearProps: "all" 
            });
        };
    });
});

function AlertSW(title, icon="success"){
    const SWDefault = Swal.mixin({
        toast: true,
        position:"top-end",
        showConfirmButton:false,
        timer:3000,
        timerProgressBar:true,
        background:'#1e1e1e',
        color:'#fff',
        iconColor:'#00ff00',
        didOpen: (toast) =>{
            toast.addEventListener('mouseenter',Swal.stopTimer)
            toast.addEventListener('mouseleave',Swal.resumeTimer)
        }
    });
    SWDefault.fire({
        icon: icon,
        title: title
    });
}
const cartButton = document.querySelectorAll('.Button-Card');
cartButton.forEach(button => {
    button.addEventListener('click', () => {
        const productparent = button.parentElement;
        const productItem ={
            id:button.getAttribute('data-id'),
            name:button.parentElement.querySelector('h2').innerText,
            price:productparent.querySelector('.card p').innerText,
            image:productparent.querySelector('img').src
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || []

        cart.push(productItem)

        localStorage.setItem("cart", JSON.stringify(cart))
        
        AlertSW(`The product :${productItem.name} Adedd to cart`);
    });
});

//  Search box
const search_box = document.querySelector(".search-products");
const cards = document.querySelectorAll(".card");
const search_input = document.querySelector(".input-search"); 
const no_results = document.querySelector(".no-results");
const p_no_results = document.querySelector(".p-products-search");
if(search_box){
search_box.addEventListener("click", () => {
    const filter = search_input.value.toLowerCase();
    let hasResults = false; 

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        
        if (text.includes(filter)) {
            card.style.display = ""; 
            hasResults = true; 
        } else {
            card.style.display = "none"; 
        }
    });

    if (hasResults) {
        no_results.style.display = "none";
        p_no_results.style.display = "none";
    } else {
        no_results.style.display = "flex"; 
        p_no_results.style.display = "block"; 
    }
});
}
// cart
const cart = document.querySelector('.cart-content');
const cart_payment = document.querySelector('.payment');
const data = JSON.parse(localStorage.getItem("cart")) || [];

if (cart) {
    cart.innerHTML = data.map(item => `
        <div class="card-product">
            <img src="${item.image}" alt="${item.name}">
            <div class="info">
                <h3>${item.name}</h3>
                <p class="price">${item.price}</p>
            </div>
        </div>
    `).join(''); 
}

const total = data.reduce((accumulator, item) => {
    const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    return accumulator + (isNaN(priceNum) ? 0 : priceNum);
}, 0);

if (cart_payment) {
    cart_payment.innerHTML = `
        <div class="total-price">
            <h3>Total: <span>${total.toLocaleString()} EGP</span></h3>
            <hr>
            <button class="button-cart">Check Out</button>
        </div>
    `;
}

console.log("Total using Reduce:", total);



const btnToggle = document.getElementById('btn-toggle');
const navLinks = document.querySelector('.links');

btnToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    if (navLinks.classList.contains('active')) {
        btnToggle.innerHTML = '✖';
        btnToggle.style.color = 'red'; 
    } else {
        btnToggle.innerHTML = '☰';
        btnToggle.style.color = 'var(--bg-dark)';
    }
});

document.querySelectorAll('.link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        btnToggle.innerHTML = '☰';
    });
});