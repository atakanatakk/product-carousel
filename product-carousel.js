(() => {
	const API_URL = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
	const STORAGE_KEY = "recommendedProducts";
	const FAVORITES_KEY = "favoriteProducts";
    
	const init = async () => {
	    const products = await fetchProducts();
	    if (products.length > 0) {
		buildHTML(products);
		buildCSS();
		setEvents();
	    }
	};
    
	const fetchProducts = async () => {
	    let products = JSON.parse(localStorage.getItem(STORAGE_KEY));
	    if (!products) {
		try {
		    const response = await fetch(API_URL);
		    products = await response.json();
		    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
		} catch (error) {
		    console.error("Error fetching products:", error);
		    return [];
		}
	    }
	    return products;
	};
    
	const getFavorites = () => JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    
	const storeFavorite = (id, isFavorite) => {
	    let favorites = getFavorites();
	    if (isFavorite) {
		favorites.push(id);
	    } else {
		favorites = favorites.filter(favId => favId !== id);
	    }
	    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
	};
    
	const buildHTML = (products) => {
	    const carouselHTML = `
		<div class="product-carousel">
		    <h2>You Might Also Like</h2>
		    <div class="carousel-list">
			${products.map(product => `
			    <div class="carousel-item">
				<a href="${product.url}" target="_blank">
				    <img src="${product.image}" alt="${product.name}" />
				</a>
				<p>${product.name}</p>
				<span class="heart-icon ${getFavorites().includes(product.id) ? "favorite" : ""}" data-id="${product.id}">&#9829;</span>
			    </div>
			`).join('')}
		    </div>
		</div>
	    `;
    
	    $(".product-detail").after(carouselHTML);
	};
    
	const buildCSS = () => {
	    const css = `
		.product-carousel {
		    margin-top: 20px;
		    padding: 10px;
		    background: #f9f9f9;
		    border-radius: 5px;
		}
		.product-carousel h2 {
		    font-size: 18px;
		    margin-bottom: 10px;
		}
		.carousel-list {
		    display: flex;
		    overflow-x: auto;
		    gap: 10px;
		    padding-bottom: 10px;
		}
		.carousel-item {
		    min-width: 150px;
		    text-align: center;
		    background: white;
		    padding: 10px;
		    border-radius: 5px;
		    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		}
		.carousel-item img {
		    width: 100%;
		    height: auto;
		    border-radius: 5px;
		}
		.heart-icon {
		    display: inline-block;
		    cursor: pointer;
		    font-size: 20px;
		    color: gray;
		    margin-top: 5px;
		}
		.heart-icon.favorite {
		    color: blue;
		}
		@media (max-width: 768px) {
		    .carousel-item {
			min-width: 120px;
		    }
		}
	    `;
    
	    $("<style>").addClass("carousel-style").html(css).appendTo("head");
	};
    
	const setEvents = () => {
	    $(".heart-icon").on("click", function (event) {
		event.preventDefault();
		const heart = $(this);
		const productId = heart.data("id");
		const isNowFavorite = !heart.hasClass("favorite");
    
		heart.toggleClass("favorite", isNowFavorite);
		storeFavorite(productId, isNowFavorite);
	    });
	};
    
	init();
    })();