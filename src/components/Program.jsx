import { invitation } from '../config'
import { ProgramIcon } from './LineArt'
import Reveal from './Reveal'

export default function Program() {
  return (
    <div className="program">
      <Reveal className="program-line" />
      {invitation.program.map((item, i) => (
        <Reveal key={item.title} className="program-item" delay={i * 180}>
          <span className="program-dot" />
          <ProgramIcon name={item.icon} className="program-icon" />
          <p className="program-time">{item.time}</p>
          <p className="program-title">{item.title}</p>
          <p className="detail-sub">{item.note}</p>
        </Reveal>
      ))}
    </div>
  )
}
