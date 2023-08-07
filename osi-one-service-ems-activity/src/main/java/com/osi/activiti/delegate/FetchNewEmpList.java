package com.osi.activiti.delegate;


import java.util.List;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.Expression;
import org.activiti.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

import com.osi.ems.domain.OsiWFActivities;

@Component
public class FetchNewEmpList implements JavaDelegate {

	private Expression size;
	private Expression list;
	private Expression object;
	
	/*@Autowired
	private IOsiWFActivitiesRepository wfsActivitiesRepo;*/
	
	@SuppressWarnings("unchecked")
	@Override
	public void execute(DelegateExecution execution) throws Exception {
		
		//List<OsiWFActivities> newEmpList = wfsActivitiesRepo.findByProcessFlag("N");
		/*List<Integer> list = new ArrayList<Integer>();
		list.add(10);
		list.add(20);
		execution.setVariable("emplist", list);*/
		System.out.println(execution.getVariableInstances());
		List<OsiWFActivities> newEmpList = (List<OsiWFActivities>) execution.getVariable("empList");
		System.out.println(newEmpList.size());
		System.out.println("---------------------------------");
		/*System.out.println(list.getValue(execution));
		System.out.println(size.getValue(execution));
		System.out.println(object.getValue(execution));*/
		execution.setVariable("list", list.getValue(execution));
		execution.setVariable("size", (Integer)size.getValue(execution));
		execution.setVariable("object", object.getValue(execution));
		System.out.println("---------------------------------");
		//String sze = (String) size.getValue(execution);
		
		//System.out.println(sze);
		
	}

	/*public Expression getList() {
		System.out.println("GET --- "+list);
		return list;
	}

	public void setList(Expression list) {
		System.out.println("SET --- "+list);
		this.list = list;
	}*/

}
