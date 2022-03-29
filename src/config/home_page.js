import ArticleCard from "../components/Cards/Article";
import { articleService } from "../services/article.service";
import { brandService } from "../services/brand.service";
import cookie from 'js-cookie'
import { MY_LOCATION_PLACE } from "../helpers/constants";
import BrandCard from "../components/Cards/Brand";
import { dispensaryService } from "../services";
import { BusinessSliderCard } from "../components/Cards/Business";

const getStateUrlParams = () => {
    let stateId = localStorage.getItem(MY_LOCATION_PLACE) ? JSON.parse(localStorage.getItem(MY_LOCATION_PLACE)).stateId : '5edb4d710d4aabf5f52645ad'
    if(localStorage.getItem(MY_LOCATION_PLACE)){
        return `?size=15&page=1&filterfield[]=featuredInStates&filtertype[]=eq&filtervalue[]=${stateId}`
    } else {
        stateId = null
    }
}

const getCityUrlParams = () => {
    let cityId = localStorage.getItem(MY_LOCATION_PLACE) ? JSON.parse(localStorage.getItem(MY_LOCATION_PLACE)).cityId : false
    if(localStorage.getItem(MY_LOCATION_PLACE)){
        return `?size=15&page=1&filterfield[]=cities.city&filtertype[]=eq&filtervalue[]=${cityId}`
    } else {
        cityId = null
    }
}

export const home_sliders = {
    // featuredProducts: {
    //     service: productService.getAll,
    //     urlParams:getStateUrlParams(),
    //     title:'Browse Products',
    //     subtitle:'Discover popular products near you',
    //     urlButton: '/products/categorize',
    //     buttonText: 'See more',
    //     geolocate: false,
    //     fullWidth: true,
    //     paddingTop: true,
    //     paddingBottom: true,
    //     autoplay:true,
    //     card: ProductCard
    // },
    // mostPopularProducts: {
    //     service: productService.getAll,
    //     urlParams:getStateUrlParams(),
    //     title:'Best products',
    //     subtitle:'Try the products that people like',
    //     geolocate: true,
    //     urlButton: '/products/categorize',
    //     buttonText: 'See more ',
    //     fullWidth: true,
    //     paddingTop: true,
    //     paddingBottom: true,
    //     autoplay: true,
    //     card: ProductCard
    // },
    // mostPopularStrains: {
    //     service: strainService.getAll,
    //     urlParams:'?size=15&page=0&sortField=avgRating&sortOrder=desc',
    //     title:'Popular Strains',
    //     geolocate: false,
    //     urlButton: '/strains',
    //     buttonText: 'See more strains ',
    //     fullWidth: true,
    //     paddingTop: true,
    //     paddingBottom: true,
    //     card: StrainCard
    // },
    nearestRetailers: {
        service: dispensaryService.getNear,
        urlParams:'?size=15&page=0&featuredData=featuredOnHomeSlider&featuredByMileage=true&sortOrder=asc&filterfield[]=type&filtertype[]=eq&filtervalue[]=DISPENSARY',
        title:'Dispensaries Near You',
        // subtitle:'They might have what you wish',
        urlButton: '/businesses#dispensaries',
        buttonText: 'See more',
        disableText: false,
        geolocate: true,
        fullWidth: true,
        paddingTop: false,
        paddingBottom: true,
        borderBottom:true,
        card: BusinessSliderCard,
        noOpenResultsMessage: 'There are no open dispensaries open near you.'
        // featuredCard: BusinessSliderCard
    },
    deliveriesCoveringLocation: {
        service: dispensaryService.getAll,
        urlParams:'?size=15&page=0&featuredData=featuredOnHomeSlider&featuredByMileage=false&sortOrder=desc&geotype=intersect&filterfield[]=type&filtertype[]=eq&filtervalue[]=DELIVERY',
        title:'Delivery Services In Your Area',
        // subtitle:'They might have what you wish',
        urlButton: '/businesses#deliveries',
        buttonText: 'See more',
        disableText: false,
        geolocate: true,
        fullWidth: true,
        paddingTop: true,
        paddingBottom: true,
        borderBottom:true,
        card: BusinessSliderCard,
        noOpenResultsMessage: 'There are no open deliveries open near you.'
        // featuredCard: DispensarySliderBigCard
    },
    featuredBrands: {
        service: brandService.getAll,
        urlParams:getStateUrlParams(),
        secondUrlParam:getCityUrlParams(),
        title:'Featured Brands',
        // subtitle:'Discover the best cannabis products creators',
        disableMoreButton: false,
        urlButton: '/brands',
        buttonText: 'See more',
        geolocate: false,
        fullWidth: true,
        paddingTop: true,
        paddingBottom: true,
        borderBottom:true,
        card: BrandCard
    },
    // featuredBrandsStrain: {
    //     service: strainService.getFeaturedBrands,
    //     urlParams:'?',
    //     title:'Featured Brands Carrying This Strain',
    //     // subtitle:'Discover the best cannabis products creators',
    //     disableMoreButton: false,
    //     urlButton: '/brands',
    //     buttonText: 'See more',
    //     geolocate: false,
    //     fullWidth: true,
    //     paddingTop: true,
    //     paddingBottom: true,
    //     card: BrandCard
    // },
    lastestArticles: {
        service: articleService.getAll,
        urlParams:'?size=10&page=1',
        title:'Lastest Articles',
        subtitle:'Stay up to date with the cannabis world',
        urlButton: '/library',
        buttonText: 'See more',
        geolocate: false,
       
        card: ArticleCard
    },
}