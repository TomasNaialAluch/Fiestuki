import bannerCumples from '../assets/banners/Banner webs_Mesa de trabajo 1.jpg';
import bannerDespedida from '../assets/banners/Banner webs-02.jpg';
import bannerBabyShower from '../assets/banners/Banner webs-03.jpg';
import bannerReligion from '../assets/banners/Banner webs-04.jpg';
import bannerPatrias from '../assets/banners/Banner webs-05.jpg';

const banners = {
  'cumpleaños': bannerCumples, // CAMBIÉ cumples por cumpleaños
  'despedida': bannerDespedida,
  'baby-shower': bannerBabyShower,
  'religion': bannerReligion,
  'fiestas-patrias': bannerPatrias,
};

export default function getBannerByCategory(categoryId) {
  return banners[categoryId] || null;
}
