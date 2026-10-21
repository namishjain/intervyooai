import { Link } from 'react-router'
import "../style/home.scss"

const Home = () => {
  return (
    <main className="home-page">
      <header className="home-header">
        <Link className="brand" to="/" aria-label="Intervyoo home">
          <span className="brand-mark" aria-hidden="true">i</span>
          <span>intervyoo<span className="brand-dot">.</span></span>
        </Link>
        <div className="header-note">
          <span className="status-dot" aria-hidden="true" />
          AI-powered interview prep
        </div>
      </header>

      <section className="home-content" aria-labelledby="home-title">
        <div className="home-intro">
          <p className="eyebrow"><span>01</span> YOUR NEXT INTERVIEW STARTS HERE</p>
          <h1 id="home-title">Show them what<br />you’re <span>made of.</span></h1>
          <p className="intro-copy">
            Add a role and a little about yourself. We’ll help you prepare with a
            personalized interview report.
          </p>
        </div>

        <div className="interview-input-group">
          <section className="form-card job-card" aria-labelledby="job-title">
            <div className="card-heading">
              <span className="step-number">01</span>
              <div>
                <h2 id="job-title">The role</h2>
                <p>What are you applying for?</p>
              </div>
            </div>
            <label className="field-label" htmlFor="jobDescription">Job description</label>
            <textarea
              name="jobDescription"
              id="jobDescription"
              placeholder="Paste the job description here..."
            />
            <p className="field-hint">Include the responsibilities and qualifications for the best results.</p>
          </section>

          <div className="right">
            <section className="form-card resume-card" aria-labelledby="resume-title">
              <div className="card-heading">
                <span className="step-number">02</span>
                <div>
                  <h2 id="resume-title">Your experience</h2>
                  <p>Give us a little more context.</p>
                </div>
              </div>
              <label className="upload-area" htmlFor="resume">
                <span className="upload-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 15v4h14v-4" />
                  </svg>
                </span>
                <span className="upload-title">Upload your resume</span>
                <span className="upload-hint">PDF format · optional</span>
              </label>
              <input hidden type="file" name="resume" id="resume" accept=".pdf" />
            </section>

            <section className="form-card about-card" aria-labelledby="about-title">
              <div className="card-heading">
                <span className="step-number">03</span>
                <div>
                  <h2 id="about-title">A little about you</h2>
                  <p>What should we know?</p>
                </div>
              </div>
              <label className="field-label" htmlFor="selfDescription">Your introduction</label>
              <textarea
                name="selfDescription"
                id="selfDescription"
                placeholder="Share your strengths, experience, and what makes you a great fit..."
              />
              <button type="button" className="button primary-button">
                Generate my report
                <span aria-hidden="true">↗</span>
              </button>
            </section>
          </div>
        </div>
        <p className="privacy-note"><span aria-hidden="true">✦</span> Your information is only used to prepare your interview report.</p>
      </section>
    </main>
  )
}

export default Home
