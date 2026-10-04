import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [options, setOptions] = useState(null);

  const [formData, setFormData] = useState({
    Season: "",
    Competition: "",
    Playing_Position: "",
    Type: "",
    Goal_assist: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // LOAD OPTIONS FROM BACKEND
  // ==========================================

  useEffect(() => {
    fetch("http://127.0.0.1:8000/options")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load options");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Options:", data);
        setOptions(data);
      })
      .catch((error) => {
        console.error("Error loading options:", error);
      });
  }, []);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear old prediction
    setResult(null);
  };

  // ==========================================
  // HANDLE PREDICTION
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Make sure all fields are selected
    if (
      !formData.Season ||
      !formData.Competition ||
      !formData.Playing_Position ||
      !formData.Type ||
      !formData.Goal_assist
    ) {
      alert("Please select all match information.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          "Backend error:",
          errorText
        );

        throw new Error(
          "Prediction request failed"
        );
      }

      const data = await response.json();

      console.log(
        "Prediction result:",
        data
      );

      setResult(data);

    } catch (error) {

      console.error(
        "Prediction error:",
        error
      );

      alert(
        "Could not connect to the prediction server."
      );

    } finally {

      setLoading(false);

    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (!options) {
    return (
      <div className="loading-screen">

        <div className="loader"></div>

        <h2>
          Loading Messi AI...
        </h2>

        <p>
          Connecting to prediction engine
        </p>

      </div>
    );
  }

  // ==========================================
  // MODELS
  // ==========================================

  const models = [
    {
      name: "Logistic Regression",
      key: "logistic_regression",
      accuracy: "95.03%",
    },

    {
      name: "KNN",
      key: "knn",
      accuracy: "96.45%",
    },

    {
      name: "Naive Bayes",
      key: "naive_bayes",
      accuracy: "96.45%",
    },

    {
      name: "Decision Tree",
      key: "decision_tree",
      accuracy: "100%",
    },

    {
      name: "SVM",
      key: "svm",
      accuracy: "95.74%",
    },
  ];

  // ==========================================
  // MAJORITY VOTE
  // ==========================================

  const getMajorityPrediction = () => {

    if (!result) {
      return {
        club: null,
        votes: 0,
        total: 0,
      };
    }

    const predictions = models
      .map((model) => result[model.key])
      .filter(
        (prediction) =>
          prediction !== undefined &&
          prediction !== null &&
          prediction !== ""
      );


    // Count each club
    const counts = {};

    predictions.forEach((club) => {

      if (counts[club]) {
        counts[club] += 1;
      } else {
        counts[club] = 1;
      }

    });


    // Sort clubs by number of votes
    const sortedClubs = Object.entries(
      counts
    ).sort(
      (a, b) => b[1] - a[1]
    );


    // No predictions
    if (sortedClubs.length === 0) {
      return {
        club: "No prediction",
        votes: 0,
        total: 0,
      };
    }


    return {
      club: sortedClubs[0][0],
      votes: sortedClubs[0][1],
      total: predictions.length,
    };
  };


  const majority = getMajorityPrediction();


  // ==========================================
  // WEBSITE
  // ==========================================

  return (
    <div className="app">

      {/* =====================================
          BACKGROUND
      ====================================== */}

      <div className="background-glow glow-one"></div>

      <div className="background-glow glow-two"></div>


      {/* =====================================
          NAVBAR
      ====================================== */}

      <nav className="navbar">

        <div className="brand">

          <div className="brand-icon">
            ⚽
          </div>

          <div>

            <div className="brand-name">
              MESSI<span>AI</span>
            </div>

            <div className="brand-subtitle">
              FOOTBALL INTELLIGENCE
            </div>

          </div>

        </div>


        <div className="nav-status">

          <span className="status-dot"></span>

          AI ENGINE ONLINE

        </div>

      </nav>


      {/* =====================================
          MAIN
      ====================================== */}

      <main>


        {/* ===================================
            HERO
        ==================================== */}

        <section className="hero">

          <div className="hero-badge">

            <span>✦</span>

            MACHINE LEARNING FOOTBALL ANALYTICS

          </div>


          <h1>

            Predict the

            <span> Club.</span>

          </h1>


          <p>

            An intelligent football prediction
            system powered by multiple machine
            learning algorithms.

          </p>

        </section>


        {/* ===================================
            MAIN GRID
        ==================================== */}

        <section className="main-grid">


          {/* =================================
              INPUT CARD
          ================================== */}

          <div className="prediction-card">

            <div className="card-heading">

              <div>

                <span className="eyebrow">
                  PREDICTION ENGINE
                </span>

                <h2>
                  Match Information
                </h2>

                <p>
                  Enter the match characteristics below.
                </p>

              </div>


              <div className="card-icon">
                ⚡
              </div>

            </div>


            {/* FORM */}

            <form onSubmit={handleSubmit}>

              <div className="form-grid">


                {/* SEASON */}

                <div className="field">

                  <label>
                    Season
                  </label>

                  <select
                    name="Season"
                    value={formData.Season}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select season
                    </option>

                    {options.Season.map(
                      (item) => (

                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* COMPETITION */}

                <div className="field">

                  <label>
                    Competition
                  </label>

                  <select
                    name="Competition"
                    value={formData.Competition}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select competition
                    </option>

                    {options.Competition.map(
                      (item) => (

                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* PLAYING POSITION */}

                <div className="field">

                  <label>
                    Playing Position
                  </label>

                  <select
                    name="Playing_Position"
                    value={formData.Playing_Position}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select position
                    </option>

                    {options.Playing_Position.map(
                      (item) => (

                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* GOAL TYPE */}

                <div className="field">

                  <label>
                    Goal Type
                  </label>

                  <select
                    name="Type"
                    value={formData.Type}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select goal type
                    </option>

                    {options.Type.map(
                      (item) => (

                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* GOAL ASSIST */}

                <div className="field full-width">

                  <label>
                    Goal Assist
                  </label>

                  <select
                    name="Goal_assist"
                    value={formData.Goal_assist}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select assist
                    </option>

                    {options.Goal_assist.map(
                      (item) => (

                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>

                      )
                    )}

                  </select>

                </div>

              </div>


              {/* =================================
                  PREDICT BUTTON
              ================================== */}

              <button
                className="predict-button"
                type="submit"
                disabled={loading}
              >

                {loading ? (

                  <>

                    <span className="button-loader"></span>

                    ANALYZING...

                  </>

                ) : (

                  <>

                    <span>
                      ⚡
                    </span>

                    PREDICT CLUB

                    <span>
                      →
                    </span>

                  </>

                )}

              </button>

            </form>

          </div>


          {/* =================================
              RESULTS CARD
          ================================== */}

          <div className="results-card">

            <div className="card-heading">

              <div>

                <span className="eyebrow">
                  AI OUTPUT
                </span>

                <h2>
                  Predictions
                </h2>

                <p>
                  Five models analyze the same input.
                </p>

              </div>


              <div className="prediction-icon">
                ✦
              </div>

            </div>


            {/* =================================
                NO RESULT
            ================================== */}

            {!result ? (

              <div className="empty-state">

                <div className="empty-icon">
                  ⚽
                </div>

                <h3>
                  Awaiting prediction
                </h3>

                <p>
                  Select your match parameters and
                  run the prediction engine.
                </p>

              </div>

            ) : (

              <>

                {/* =================================
                    MAJORITY PREDICTION
                ================================== */}

                <div className="majority-result">

                  <div className="majority-label">
                    MAJORITY PREDICTION
                  </div>


                  <div className="majority-club">

                    {majority.club}

                  </div>


                  <div className="majority-votes">

                    {majority.votes} of{" "}
                    {majority.total} models agree

                  </div>

                </div>


                {/* =================================
                    INDIVIDUAL MODEL RESULTS
                ================================== */}

                <div className="results-list">

                  {models.map(
                    (model, index) => (

                      <div
                        className="model-result"
                        key={model.key}
                      >

                        <div className="model-left">

                          <div className="model-number">
                            {index + 1}
                          </div>


                          <div>

                            <div className="model-name">
                              {model.name}
                            </div>


                            <div className="model-accuracy">
                              Accuracy:{" "}
                              {model.accuracy}
                            </div>

                          </div>

                        </div>


                        <div className="prediction-value">

                          {result[model.key]}

                        </div>

                      </div>

                    )
                  )}

                </div>

              </>

            )}

          </div>

        </section>


        {/* =====================================
            MODEL PERFORMANCE
        ====================================== */}

        {result && (

          <section className="performance-section">

            <div className="section-header">

              <div>

                <span className="eyebrow">
                  MODEL PERFORMANCE
                </span>

                <h2>
                  The prediction stack
                </h2>

              </div>


              <span className="section-note">
                Test-set accuracy
              </span>

            </div>


            <div className="performance-grid">

              {models.map(
                (model) => (

                  <div
                    className="performance-card"
                    key={model.key}
                  >

                    <div className="performance-top">

                      <span className="performance-name">
                        {model.name}
                      </span>


                      <span className="performance-icon">
                        ↗
                      </span>

                    </div>


                    <div className="accuracy">
                      {model.accuracy}
                    </div>


                    <div className="accuracy-bar">

                      <div
                        className="accuracy-fill"
                        style={{
                          width: model.accuracy,
                        }}
                      ></div>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>

        )}


        {/* =====================================
            HOW IT WORKS
        ====================================== */}

        {result && (

          <section className="how-section">

            <div className="section-header">

              <div>

                <span className="eyebrow">
                  HOW IT WORKS
                </span>

                <h2>
                  From input to prediction
                </h2>

              </div>

            </div>


            <div className="steps">


              {/* STEP 1 */}

              <div className="step">

                <div className="step-number">
                  01
                </div>

                <h3>
                  Input
                </h3>

                <p>
                  Match characteristics are collected
                  from the user.
                </p>

              </div>


              <div className="step-line"></div>


              {/* STEP 2 */}

              <div className="step">

                <div className="step-number">
                  02
                </div>

                <h3>
                  Process
                </h3>

                <p>
                  Data is encoded and standardized
                  before inference.
                </p>

              </div>


              <div className="step-line"></div>


              {/* STEP 3 */}

              <div className="step">

                <div className="step-number">
                  03
                </div>

                <h3>
                  Predict
                </h3>

                <p>
                  Five machine learning models generate
                  their predictions.
                </p>

              </div>

            </div>

          </section>

        )}

      </main>


      {/* =====================================
          FOOTER
      ====================================== */}

      <footer>

        <div>

          <strong>
            MESSI<span>AI</span>
          </strong>

          <span className="footer-muted">

            &nbsp; • &nbsp;

            Machine Learning Football Intelligence

          </span>

        </div>


        <div className="footer-status">

          ● SYSTEM OPERATIONAL

        </div>

      </footer>

    </div>
  );
}

export default App;