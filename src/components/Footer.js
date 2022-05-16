import './Footer.css'
import discode_while from '../assets/discord.png';
import instagram_white from '../assets/instagram.png';
import twitter_white from '../assets/twitter.png';

function Footer(props) {
    return(
        <footer className='footer'>
            <p>
                SMART CONTACT ADDRESS:&nbsp;
                <br />
                <span>
                    <a className='contact-link' href={`https://mumbai.polygonscan.com/address/${props.address}`} target='_blank' rel='noreferrer'>
                        {props.address}
                    </a>
                </span>
            </p>
            <div className='footer-social-media-links'>
                <div>
                    <a href=''>
                        <img src={discode_while} alt="Discode"/>
                    </a>
                </div>
                <div>
                    <a href=''>
                        <img src={instagram_white} alt="Instagram"/>
                    </a>
                </div>
                <div>
                    <a href='https://twitter.com/mugi_web3'>
                        <img src={twitter_white} alt="Twitter"/>
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;