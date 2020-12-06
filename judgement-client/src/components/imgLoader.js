import CA from '../resources/img/AC.png';
import C2 from '../resources/img/2C.png';
import C3 from '../resources/img/3C.png';
import C4 from '../resources/img/4C.png';
import C5 from '../resources/img/5C.png';
import C6 from '../resources/img/6C.png';
import C7 from '../resources/img/7C.png';
import C8 from '../resources/img/8C.png';
import C9 from '../resources/img/9C.png';
import C10 from '../resources/img/10C.png';
import CJ from '../resources/img/JC.png';
import CQ from '../resources/img/QC.png';
import CK from '../resources/img/KC.png';

import SA from '../resources/img/AS.png';
import S2 from '../resources/img/2S.png';
import S3 from '../resources/img/3S.png';
import S4 from '../resources/img/4S.png';
import S5 from '../resources/img/5S.png';
import S6 from '../resources/img/6S.png';
import S7 from '../resources/img/7S.png';
import S8 from '../resources/img/8S.png';
import S9 from '../resources/img/9S.png';
import S10 from '../resources/img/10S.png';
import SJ from '../resources/img/JS.png';
import SQ from '../resources/img/QS.png';
import SK from '../resources/img/KS.png';

import DA from '../resources/img/AD.png';
import D2 from '../resources/img/2D.png';
import D3 from '../resources/img/3D.png';
import D4 from '../resources/img/4D.png';
import D5 from '../resources/img/5D.png';
import D6 from '../resources/img/6D.png';
import D7 from '../resources/img/7D.png';
import D8 from '../resources/img/8D.png';
import D9 from '../resources/img/9D.png';
import D10 from '../resources/img/10D.png';
import DJ from '../resources/img/JD.png';
import DQ from '../resources/img/QD.png';
import DK from '../resources/img/KD.png';

import HA from '../resources/img/AH.png';
import H2 from '../resources/img/2H.png';
import H3 from '../resources/img/3H.png';
import H4 from '../resources/img/4H.png';
import H5 from '../resources/img/5H.png';
import H6 from '../resources/img/6H.png';
import H7 from '../resources/img/7H.png';
import H8 from '../resources/img/8H.png';
import H9 from '../resources/img/9H.png';
import H10 from '../resources/img/10H.png';
import HJ from '../resources/img/JH.png';
import HQ from '../resources/img/QH.png';
import HK from '../resources/img/KH.png';

import BlueBack from '../resources/img/blue_back.png';
import ClubsSuit from '../resources/img/honor_clubs.png';
import HeartsSuit from '../resources/img/honor_hearts.png';
import SpadesSuit from '../resources/img/honor_spades.png';
import DiamondsSuit from '../resources/img/honor_diamonds.png';

export default function getImageSrc(imgId) {
  // eslint-disable-next-line
  switch (imgId) {
    case 'AC': return CA;
    case '2C': return C2;
    case '3C': return C3;
    case '4C': return C4;
    case '5C': return C5;
    case '6C': return C6;
    case '7C': return C7;
    case '8C': return C8;
    case '9C': return C9;
    case '10C': return C10;
    case 'JC': return CJ;
    case 'QC': return CQ;
    case 'KC': return CK;

    case 'AD': return DA;
    case '2D': return D2;
    case '3D': return D3;
    case '4D': return D4;
    case '5D': return D5;
    case '6D': return D6;
    case '7D': return D7;
    case '8D': return D8;
    case '9D': return D9;
    case '10D': return D10;
    case 'JD': return DJ;
    case 'QD': return DQ;
    case 'KD': return DK;

    case 'AH': return HA;
    case '2H': return H2;
    case '3H': return H3;
    case '4H': return H4;
    case '5H': return H5;
    case '6H': return H6;
    case '7H': return H7;
    case '8H': return H8;
    case '9H': return H9;
    case '10H': return H10;
    case 'JH': return HJ;
    case 'QH': return HQ;
    case 'KH': return HK;

    case 'AS': return SA;
    case '2S': return S2;
    case '3S': return S3;
    case '4S': return S4;
    case '5S': return S5;
    case '6S': return S6;
    case '7S': return S7;
    case '8S': return S8;
    case '9S': return S9;
    case '10S': return S10;
    case 'JS': return SJ;
    case 'QS': return SQ;
    case 'KS': return SK;

    case 'BlueBack': return BlueBack;
    case 'ClubsSuit': return ClubsSuit;
    case 'DiamondsSuit': return DiamondsSuit;
    case 'SpadesSuit': return SpadesSuit;
    case 'HeartsSuit': return HeartsSuit;
  }
}