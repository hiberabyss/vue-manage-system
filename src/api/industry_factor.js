import request from '../utils/request';
import {setConf} from '../api/adsconf'
import { ElMessage } from "element-plus";

function confDeleteEntity(conf, entity) {
  for (let k = 0; k < conf.industry_factors.length; k++) {
    let item = conf.industry_factors[k];

    for (let i = 0; i < item.entity_codes.length; i++) {
      if (item.entity_codes[i] === entity) {
        item.entity_codes.splice(i, 1);
        if (item.entity_codes.length === 0) {
          conf.industry_factors.splice(k, 1);
        }
        return;
      }
    }
  }
}

export function deleteEntity(conf, entity) {
  confDeleteEntity(conf, entity);
  setConf(conf).then(res => {
    ElMessage.success("Succefully delete the entity: " + entity);
  });
}

export function editFactor(conf, entity, factor) {
  confDeleteEntity(conf, entity);
  conf.industry_factors.push({'entity_codes': [entity], 'factor': factor});

  setConf(conf).then(res => {
    ElMessage.success("Successfully update AdSystem conf! (May needs 15 seconds to finally update)");
  });
};
