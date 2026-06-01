(() => {
  const lessonId = Number(window.LESSON_ID);
  const titleEl = document.getElementById('lessonTitle');
  const container = document.getElementById('dq-questions-container');
  const resultBox = document.getElementById('dq-result-box');

  if (!lessonId || !container) {
    return;
  }

  const usePayload = (payload) => {
    if (!payload || !Array.isArray(payload.quizzes)) {
      throw new Error('Invalid quiz payload');
    }
    const quiz = payload.quizzes.find((item) => item.id === lessonId);
      if (!quiz) {
        if (titleEl) {
          titleEl.textContent = 'Không tìm thấy bài kiểm tra';
        }
        container.innerHTML = '<p>Hiện chưa có dữ liệu cho bài này.</p>';
        return;
      }

      if (titleEl) {
        titleEl.textContent = quiz.title;
      }
      document.title = `Trắc nghiệm ${quiz.title}`;

      quiz.questions.forEach((data, index) => {
        const item = document.createElement('div');
        item.className = 'dq-quiz-item';
        item.innerHTML = `
          <span class="dq-question-text">Câu ${index + 1}: ${data.q}</span>
          <ul class="dq-options-list">
            <li><label class="dq-option-label"><input type="radio" name="dq_q${index}" value="a">A. ${data.options.a}</label></li>
            <li><label class="dq-option-label"><input type="radio" name="dq_q${index}" value="b">B. ${data.options.b}</label></li>
            <li><label class="dq-option-label"><input type="radio" name="dq_q${index}" value="c">C. ${data.options.c}</label></li>
            <li><label class="dq-option-label"><input type="radio" name="dq_q${index}" value="d">D. ${data.options.d}</label></li>
          </ul>
          <div class="dq-feedback dq-correct-ans" id="dq-ans${index}">Đáp án đúng: ${data.a.toUpperCase()}</div>
          <div class="dq-feedback dq-explanation" id="dq-exp${index}">${data.exp}</div>
        `;
        container.appendChild(item);
      });

      window.dqSubmitQuiz = () => {
        let score = 0;
        quiz.questions.forEach((data, index) => {
          const selected = document.querySelector(`input[name="dq_q${index}"]:checked`);
          const ansDiv = document.getElementById(`dq-ans${index}`);
          const expDiv = document.getElementById(`dq-exp${index}`);

          const inputs = document.querySelectorAll(`input[name="dq_q${index}"]`);
          inputs.forEach((input) => {
            const label = input.closest('label');
            if (label) {
              label.classList.remove('dq-correct', 'dq-incorrect');
            }
          });

          if (ansDiv) {
            ansDiv.style.display = 'block';
          }
          if (expDiv) {
            expDiv.style.display = 'block';
          }

          if (selected) {
            const label = selected.closest('label');
            if (label) {
              if (selected.value === data.a) {
                label.classList.add('dq-correct');
              } else {
                label.classList.add('dq-incorrect');
              }
            }
          }

          if (selected && selected.value === data.a) {
            score++;
          }
        });

        if (!resultBox) {
          return;
        }

        const total = quiz.questions.length;
        const passMark = Math.ceil(total * 0.8);
        resultBox.style.display = 'block';
        resultBox.innerHTML = `Hoàn thành! Kết quả: ${score}/${total} câu đúng.`;
        resultBox.style.background =
          score >= passMark ? 'rgba(22, 196, 127, 0.15)' : 'rgba(255, 183, 3, 0.2)';
        resultBox.style.color = score >= passMark ? '#0e5c3f' : '#7a4b00';
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };
  };

  if (window.QUIZZES) {
    try {
      usePayload(window.QUIZZES);
    } catch (err) {
      if (titleEl) {
        titleEl.textContent = 'Dữ liệu không hợp lệ';
      }
      container.innerHTML = '<p>Vui lòng cập nhật lại dữ liệu.</p>';
    }
    return;
  }

  fetch('../data/quizzes.json')
    .then((res) => res.json())
    .then((payload) => {
      usePayload(payload);
    })
    .catch(() => {
      if (titleEl) {
        titleEl.textContent = 'Không thể tải dữ liệu';
      }
      container.innerHTML = '<p>Vui lòng thử lại sau.</p>';
    });
})();
