// create Project component

import '../assets/styles.css'

function Project({title, page, repo, techs, src, alt}) {
    return(
        <div  className={`shadow-lg mb-5 p-3 position-relative border border-2 border-dark rounded ${window.innerWidth > 992 ? 'col-5 mx-auto' : ''}`}>
            <div className="image-container position-relative">
                <img src={src} alt={alt} className="w-100 "/>
                <div className= {`overlay position-absolute top-50 start-50 w-100 h-100`}>
                    <a href={page} className={`overlay-link translate-middle text-bg-light text-decoration-none rounded position-absolute top-0 start-50 border border-4 border-dark p-1`}>{title}</a>
                    <a href={repo} className={`overlay-link translate-middle text-bg-light text-decoration-none rounded position-absolute top-50 start-50 p-1 border border-4 border-dark`}>GitHub Repo</a>
                    <p className={`overlay-text translate-middle text-bg-light rounded position-absolute start-50 p-1 top-100 border border-4 border-dark`}>{techs}</p>
                </div>                                
            </div>
    </div>
    )
}

export default Project;