import '../../styles/resumeStyleB.css';
import avatarImage from  "../../assets/images/avatar_image.jpeg"

export const AvatarSection: React.FC = () => {

    return (
        <div className={"avatar-container"}>
            <div className="avatar">
                <img src={avatarImage} alt="AvatarSection"/>
            </div>
        </div>
    );
};

