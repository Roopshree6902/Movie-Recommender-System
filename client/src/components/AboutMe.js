import React from "react";
import "../styles/AboutMe.css";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import GitHubIcon from "@material-ui/icons/GitHub";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import InstagramIcon from '@mui/icons-material/Instagram';


function AboutMe() {
  return (
    <>
      <center className="body">
        <h1 className="about_title">About Creator</h1>
        <br />
      </center>
      <div className="aboutme_container">
        <div className="aboutme_card">
          <img
            className="aboutme_card__image"
            src={`${process.env.PUBLIC_URL}/assets/roop-snap.JPEG`}
            alt="Roopshree Udaiwal"
          />
          <div className="aboutme_card__content">
            <h1 className="about_name">Roopshree Udaiwal</h1>
            <div
              className="stroke"
              style={{
                backgroundColor: "white",
                height: "1px",
                width: "100%",
                marginTop: "4px",
              }}
            ></div>
            <br />
            <p>
              Hey there! Glad you clicked into my site. I am a sophomore in B.Tech CSE at Lovely Professional University. I am a self taught developer. I am most passionate in exploring new technologies & problem solving. This Movie-Recommender-System Project is a part of Intern Engage2022 Programme at Microsoft. For any queries feel free to contact through the below mentioned links.
            </p>
            <div className="aboutme_card__sociallinks">
              <div>
                <a
                  href="https://www.linkedin.com/in/roopshree-udaiwal-2831031b5/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedInIcon className="icon social_icon_linkedin" />
                </a>
                <a
                  href="https://github.com/Roopshree6902"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHubIcon className="social_icon_github " />
                </a>
                <a
                  href="https://roopshreeudaiwal.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  < AccountCircleIcon className="social_icon_account " />
                </a>
                
                <a
                  href="https://www.instagram.com/roopshree6498/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon className="icon social_icon_instagram" />
                </a>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutMe;
