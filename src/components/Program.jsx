import { invitation } from '../config'
import Reveal from './Reveal'

export default function Program() {
  return (
    <div className="program">
      <Reveal className="program-line" />
      {invitation.program.map((item, i) => (
        <Reveal key={item.title} className="program-item" delay={i * 180}>
          <span className="program-dot" />
          <p className="program-time">{item.time}</p>
          <p className="program-title">{item.title}</p>
          <p className="detail-sub">{item.note}</p>
        </Reveal>
      ))}
    </div>
  )
}
