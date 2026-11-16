# Robot Balance Lab

**Why do robots fall over?** This notebook lets you simulate a robot's balance yourself: a weight on a stick (the
inverted pendulum), feedback control, the capture point, small feet, reaction delay, and a Bode plot. Every result is
produced by a few lines of Python that you can change and re-run.

Companion to the video **"Why Robots Fall Over: Balance as a Control Problem"** on the Concepts Mentor YouTube channel:
**[add link]**

## ▶ Play first: the Balance Lab app (no install, no maths)

**https://naveenbhutani7.github.io/robot-balance-lab/** works in any browser, including on a phone.

1. **You try:** keep a pole upright with your mouse or finger. Shorter poles fall faster; a 150 ms delay makes it much harder.
2. **Robot's turn:** push a simulated robot. Choose its reaction delay, the push and its foot size, and watch it recover,
   wobble or fall, with a live graph next to it.
3. **Quick quiz:** five rounds of "will it stay up or fall?"

The app (`index.html` + `sim.js`) uses the same model as the notebook.

## Go deeper: the notebook

[![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/naveenbhutani7/robot-balance-lab/blob/main/balance_lab.ipynb)

## What you'll do (11 short parts)

| Part | Idea | What you'll see |
|---|---|---|
| 1 | The model: a = ω²(x − p), from Newton in one line | the assumptions, stated plainly |
| 2 | No control | a 1 cm lean doubles every ≈ 0.22 s; the exact solution x₀·cosh(ωt) sits on top of the simulation |
| 3 | Open loop | a perfect plan, one push, a fall |
| 4 | Closed loop | "feet under the body" only drifts; capture-point feedback brings it back |
| 5 | The push as a disturbance | the capture point jumps first, and the body follows |
| 6 | Small feet (saturation) | above one push size, no controller can save it without a step |
| 7 | Reaction delay | 50 ms settles, 150 ms rings, 200 ms grows; delay also shrinks the push you can survive |
| 8 | Gain vs delay | a brute-force stability map matches the theory: correcting harder tolerates less delay |
| 9 | Frequency domain | a Bode plot: delay eats the phase margin |
| 10 | Taking a step | recover by stepping, or fall when the step lands short |
| 11 | Playground | four questions to explore |

Each part ends with **"Try this"** suggestions. You only need basic Python. No control-theory background is assumed.

## Run it

**In the browser (nothing to install):** click "Open in Colab" above, then Runtime → Run all.

**On your computer:**
```bash
git clone https://github.com/naveenbhutani7/robot-balance-lab.git
cd robot-balance-lab
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
jupyter lab balance_lab.ipynb
```
Run the cells from top to bottom (Shift + Enter). The whole notebook takes about a minute; the stability map in Part 8 is
the slowest cell.

## The model, in one paragraph

Seen from the front, a standing body behaves like a weight on a stick. The weight is the centre of mass at position x and
height z. The stick stands at p, the point where the feet push on the floor (the centre of pressure). For a small lean
and a constant height:

    a = (g / z) · (x − p) = ω² · (x − p)        ω = √(g / z)

The body accelerates away from where the feet push. The robot controls only p, and p must stay inside the feet.
The capture point ξ = x + ẋ/ω is where the feet would have to push to bring the body to rest above it.

**Assumed parameters:**
- height z = 1 m
- feet: ±15 cm sideways, from outer edge to outer edge
- hips: 6 cm extra push
- correction gain k = 1
- step time 0.3 s, reach 0.45 m

This is a simple textbook model for learning. It is **not** any real robot's controller and **not** human motion data.

## Sources for the ideas

- Capture point: Pratt, Carff, Drakunov & Goswami, "Capture Point: A Step toward Humanoid Push Recovery", IEEE-RAS
  Humanoids 2006.
- The same quantity in human balance research, the "extrapolated centre of mass": Hof, Gazendam & Sinke, "The condition
  for dynamic stability", Journal of Biomechanics 38(1):1–8, 2005. https://doi.org/10.1016/j.jbiomech.2004.03.025
- Ankle and hip strategies in people: Horak & Nashner, Journal of Neurophysiology, 1986 (PMID 3734861).
- Learned humanoid control trained in simulation: Radosavovic et al., "Real-world humanoid locomotion with reinforcement
  learning", Science Robotics 9(89), 2024. https://doi.org/10.1126/scirobotics.adi9579

## Licence

MIT, see [LICENSE](LICENSE). This repository contains only the teaching notebook and the browser app; the video, its audio and its clips are not part of it.
