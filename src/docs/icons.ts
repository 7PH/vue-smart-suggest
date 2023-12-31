import { library } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';

export const loadIcons = () => {
    library.add(faGithub);
    library.add(faExternalLink);
};
