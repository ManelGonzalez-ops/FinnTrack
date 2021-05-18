import { Button } from '@material-ui/core';
import FacebookIcon from '@material-ui/icons/Facebook';

export const FacebookButton = ({ href }) => {
    return (
        <a
            href={href}
        >
            <Button
                size="large"
                startIcon={<FacebookIcon
                    style={{ width: "26px", height: "100%", color: "white" }}
                />}
                style={{ background: "#3b5998", color: "white", width: "100%" }}

            >
                Continue with Facebook
        </Button>
        </a>
    )
}