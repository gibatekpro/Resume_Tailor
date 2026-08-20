import '../../styles/resumeStyleB.css';
import avatarImage from  "../../assets/images/avatar_image.jpeg"
import placeholderImage from "../../assets/images/placeholder.jpeg"
import {useState} from "react";

export const AvatarSection: React.FC = () => {
    const [imgSrc, setImgSrc] = useState(avatarImage);

    return (
        <div className={"avatar-container"}>
            <div className="avatar">
                <img src={imgSrc} alt="AvatarSection" onError={() => setImgSrc(placeholderImage)}/>
            </div>
        </div>
    );
};

